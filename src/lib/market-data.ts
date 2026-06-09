import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { Candle } from "./indicators";

// Yahoo Finance symbols — no API key required.
export const PAIRS = [
  { value: "EUR/USD", label: "EUR/USD", yahoo: "EURUSD=X" },
  { value: "GBP/USD", label: "GBP/USD", yahoo: "GBPUSD=X" },
  { value: "USD/JPY", label: "USD/JPY", yahoo: "USDJPY=X" },
  { value: "GBP/JPY", label: "GBP/JPY", yahoo: "GBPJPY=X" },
  { value: "XAU/USD", label: "XAU/USD (Gold)", yahoo: "GC=F" },
] as const;

export type PairValue = (typeof PAIRS)[number]["value"];

function yahooSymbol(pair: string): string {
  const p = PAIRS.find((x) => x.value === pair);
  if (!p) throw new Error(`Unknown pair: ${pair}`);
  return p.yahoo;
}

export const fetchH1CandlesFn = createServerFn({ method: "GET" })
  .inputValidator(z.object({ pair: z.string() }))
  .handler(async ({ data }) => {
    const symbol = yahooSymbol(data.pair);
    const url = new URL(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}`,
    );
    url.searchParams.set("interval", "1h");
    url.searchParams.set("range", "1mo");

    const res = await fetch(url.toString(), {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (!res.ok) {
      throw new Error(`Yahoo Finance request failed: ${res.status}`);
    }
    const json = (await res.json()) as {
      chart?: {
        result?: Array<{
          timestamp?: number[];
          indicators?: {
            quote?: Array<{
              open?: (number | null)[];
              high?: (number | null)[];
              low?: (number | null)[];
              close?: (number | null)[];
            }>;
          };
        }>;
        error?: { description?: string } | null;
      };
    };

    if (json.chart?.error) {
      throw new Error(json.chart.error.description ?? "Yahoo Finance error");
    }
    const result = json.chart?.result?.[0];
    const ts = result?.timestamp ?? [];
    const q = result?.indicators?.quote?.[0];
    if (!q || !ts.length) throw new Error("No candle data returned");

    const candles: Candle[] = [];
    for (let i = 0; i < ts.length; i++) {
      const o = q.open?.[i];
      const h = q.high?.[i];
      const l = q.low?.[i];
      const c = q.close?.[i];
      if (o == null || h == null || l == null || c == null) continue;
      candles.push({ time: ts[i], open: o, high: h, low: l, close: c });
    }
    candles.sort((a, b) => a.time - b.time);

    // Drop currently-forming candle
    const nowHourStart = Math.floor(Date.now() / 3_600_000) * 3600;
    return candles.filter((c) => c.time < nowHourStart);
  });

export async function fetchH1Candles(pair: string): Promise<Candle[]> {
  return await fetchH1CandlesFn({ data: { pair } });
}
