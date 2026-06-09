import type { Candle } from "./indicators";

// Twelve Data symbols
export const PAIRS = [
  { value: "EUR/USD", label: "EUR/USD" },
  { value: "GBP/USD", label: "GBP/USD" },
  { value: "USD/JPY", label: "USD/JPY" },
  { value: "GBP/JPY", label: "GBP/JPY" },
  { value: "XAU/USD", label: "XAU/USD (Gold)" },
] as const;

export type PairValue = (typeof PAIRS)[number]["value"];

interface TDResponse {
  status?: string;
  message?: string;
  values?: Array<{
    datetime: string;
    open: string;
    high: string;
    low: string;
    close: string;
  }>;
}

export async function fetchH1Candles(
  pair: string,
  apiKey: string,
  outputsize = 250,
): Promise<Candle[]> {
  const url = new URL("https://api.twelvedata.com/time_series");
  url.searchParams.set("symbol", pair);
  url.searchParams.set("interval", "1h");
  url.searchParams.set("outputsize", String(outputsize));
  url.searchParams.set("apikey", apiKey);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Market data request failed: ${res.status}`);
  const json = (await res.json()) as TDResponse;
  if (json.status === "error" || !json.values) {
    throw new Error(json.message || "Failed to fetch candles");
  }

  // Twelve Data returns newest first. Reverse to oldest → newest.
  const candles: Candle[] = json.values
    .map((v) => ({
      time: Math.floor(new Date(v.datetime + "Z").getTime() / 1000),
      open: parseFloat(v.open),
      high: parseFloat(v.high),
      low: parseFloat(v.low),
      close: parseFloat(v.close),
    }))
    .sort((a, b) => a.time - b.time);

  // Drop the currently-forming candle if its open hour matches the current hour
  const nowHourStart = Math.floor(Date.now() / 3_600_000) * 3600;
  const closed = candles.filter((c) => c.time < nowHourStart);
  return closed;
}
