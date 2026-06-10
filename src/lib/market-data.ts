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

export type Timeframe =
  | "MN"
  | "W1"
  | "D1"
  | "H4"
  | "H1"
  | "M30"
  | "M15"
  | "M1";

export const TIMEFRAMES: Timeframe[] = [
  "MN",
  "W1",
  "D1",
  "H4",
  "H1",
  "M30",
  "M15",
  "M1",
];

interface TfConfig {
  interval: string; // Yahoo interval (skip for H4 — aggregated)
  range: string;
  intervalSec: number; // bucket size in seconds (approx for MN)
}

const TF_CONFIG: Record<Exclude<Timeframe, "H4">, TfConfig> = {
  MN: { interval: "1mo", range: "10y", intervalSec: 30 * 86400 },
  W1: { interval: "1wk", range: "5y", intervalSec: 7 * 86400 },
  D1: { interval: "1d", range: "2y", intervalSec: 86400 },
  H1: { interval: "1h", range: "60d", intervalSec: 3600 },
  M30: { interval: "30m", range: "30d", intervalSec: 1800 },
  M15: { interval: "15m", range: "15d", intervalSec: 900 },
  M1: { interval: "1m", range: "5d", intervalSec: 60 },
};

function yahooSymbol(pair: string): string {
  const p = PAIRS.find((x) => x.value === pair);
  if (!p) throw new Error(`Unknown pair: ${pair}`);
  return p.yahoo;
}

async function fetchYahoo(
  symbol: string,
  interval: string,
  range: string,
): Promise<Candle[]> {
  const url = new URL(
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}`,
  );
  url.searchParams.set("interval", interval);
  url.searchParams.set("range", range);

  const res = await fetch(url.toString(), {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  if (!res.ok) {
    throw new Error(`Yahoo ${interval} failed: ${res.status}`);
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
    throw new Error(json.chart.error.description ?? "Yahoo error");
  }
  const result = json.chart?.result?.[0];
  const ts = result?.timestamp ?? [];
  const q = result?.indicators?.quote?.[0];
  if (!q || !ts.length) return [];

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
  return candles;
}

function dropForming(candles: Candle[], intervalSec: number): Candle[] {
  const nowSec = Math.floor(Date.now() / 1000);
  return candles.filter((c) => c.time + intervalSec <= nowSec + 1);
}

// Aggregate H1 → H4. Group every 4 hourly candles aligned to UTC hour % 4 == 0.
function aggregateH4(h1: Candle[]): Candle[] {
  const buckets = new Map<number, Candle[]>();
  for (const c of h1) {
    const bucketStart = c.time - (c.time % (4 * 3600));
    const arr = buckets.get(bucketStart) ?? [];
    arr.push(c);
    buckets.set(bucketStart, arr);
  }
  const out: Candle[] = [];
  for (const [start, arr] of buckets) {
    arr.sort((a, b) => a.time - b.time);
    out.push({
      time: start,
      open: arr[0].open,
      high: Math.max(...arr.map((x) => x.high)),
      low: Math.min(...arr.map((x) => x.low)),
      close: arr[arr.length - 1].close,
    });
  }
  out.sort((a, b) => a.time - b.time);
  return out;
}

export type TimeframeCandles = Record<Timeframe, Candle[]>;

export const fetchAllTimeframesFn = createServerFn({ method: "GET" })
  .inputValidator(z.object({ pair: z.string() }))
  .handler(async ({ data }) => {
    const symbol = yahooSymbol(data.pair);
    const entries = await Promise.all(
      (Object.keys(TF_CONFIG) as Array<keyof typeof TF_CONFIG>).map(
        async (tf) => {
          const cfg = TF_CONFIG[tf];
          try {
            const raw = await fetchYahoo(symbol, cfg.interval, cfg.range);
            return [tf, dropForming(raw, cfg.intervalSec)] as const;
          } catch {
            return [tf, [] as Candle[]] as const;
          }
        },
      ),
    );
    const map = Object.fromEntries(entries) as Record<
      Exclude<Timeframe, "H4">,
      Candle[]
    >;
    const h4 = aggregateH4(map.H1);
    const nowSec = Math.floor(Date.now() / 1000);
    const h4Closed = h4.filter((c) => c.time + 4 * 3600 <= nowSec + 1);
    return { ...map, H4: h4Closed } as TimeframeCandles;
  });

export async function fetchAllTimeframes(
  pair: string,
): Promise<TimeframeCandles> {
  return await fetchAllTimeframesFn({ data: { pair } });
}
