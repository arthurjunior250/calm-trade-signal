import {
  Candle,
  ema,
  rsi,
  macd,
  atr,
} from "./indicators";
import type { Timeframe, TimeframeCandles } from "./market-data";

export type Decision = "BUY" | "SELL" | "HOLD";

const LOCK_MS = 10 * 60 * 1000;
export const LOCK_DURATION_MS = LOCK_MS;

// Weight per timeframe (sum = 100). Higher TFs dominate, but lower TFs still vote.
const TF_WEIGHT: Record<Timeframe, number> = {
  MN: 5,
  W1: 8,
  D1: 12,
  H4: 15,
  H1: 20,
  M30: 15,
  M15: 15,
  M1: 10,
};

export interface TimeframeAnalysis {
  tf: Timeframe;
  weight: number;
  bias: -1 | 0 | 1; // overall direction
  strength: number; // 0..1 (agreement among indicators)
  score: number; // weight * bias * strength (signed)
  close: number;
  ema20: number | null;
  ema50: number | null;
  rsi: number | null;
  macdHist: number | null;
  note: string;
}

export interface GeneratedSignal {
  pair: string;
  decision: Decision;
  confidence: number; // 0..100
  entry: number;
  stopLoss: number;
  takeProfit: number;
  riskReward: number;
  generatedAt: number;
  expiresAt: number;
  timeframes: TimeframeAnalysis[];
  totalScore: number; // -100..100
}

function analyzeOneTf(tf: Timeframe, weight: number, candles: Candle[]): TimeframeAnalysis {
  const closes = candles.map((c) => c.close);
  const last = closes[closes.length - 1] ?? 0;
  const e20 = ema(closes, 20);
  const e50 = ema(closes, 50);
  const r = rsi(closes, 14);
  const m = macd(closes);

  if (!candles.length) {
    return {
      tf,
      weight,
      bias: 0,
      strength: 0,
      score: 0,
      close: 0,
      ema20: null,
      ema50: null,
      rsi: null,
      macdHist: null,
      note: "No data",
    };
  }

  // Vote system: each indicator votes -1 / 0 / +1
  const votes: number[] = [];
  // Trend
  if (e20 != null && e50 != null) {
    if (last > e20 && e20 > e50) votes.push(1);
    else if (last < e20 && e20 < e50) votes.push(-1);
    else votes.push(0);
  }
  // RSI
  if (r != null) {
    if (r > 55 && r < 75) votes.push(1);
    else if (r < 45 && r > 25) votes.push(-1);
    else votes.push(0);
  }
  // MACD histogram
  if (m) {
    if (m.histogram > 0) votes.push(1);
    else if (m.histogram < 0) votes.push(-1);
    else votes.push(0);
  }

  let bias: -1 | 0 | 1 = 0;
  let strength = 0;
  if (votes.length) {
    const sum = votes.reduce((a, b) => a + b, 0);
    const avg = sum / votes.length; // -1..1
    if (avg > 0.2) bias = 1;
    else if (avg < -0.2) bias = -1;
    strength = Math.abs(avg);
  }
  const score = weight * bias * strength;
  const note = bias === 1 ? "Bullish" : bias === -1 ? "Bearish" : "Neutral";

  return {
    tf,
    weight,
    bias,
    strength,
    score,
    close: last,
    ema20: e20,
    ema50: e50,
    rsi: r,
    macdHist: m?.histogram ?? null,
    note,
  };
}

export function generateSignal(
  pair: string,
  data: TimeframeCandles,
): GeneratedSignal {
  const timeframes: TimeframeAnalysis[] = (Object.keys(TF_WEIGHT) as Timeframe[]).map(
    (tf) => analyzeOneTf(tf, TF_WEIGHT[tf], data[tf] ?? []),
  );

  const totalScore = timeframes.reduce((a, t) => a + t.score, 0);
  let decision: Decision = "HOLD";
  if (totalScore >= 25) decision = "BUY";
  else if (totalScore <= -25) decision = "SELL";

  const confidence = Math.min(100, Math.round(Math.abs(totalScore)));

  // Entry from most recent low-TF close (M1 → fallback chain)
  const liveCandles =
    data.M1.length ? data.M1 : data.M15.length ? data.M15 : data.M30.length ? data.M30 : data.H1;
  const entry = liveCandles[liveCandles.length - 1].close;

  // SL/TP sized off H1 ATR for stability
  const h1Atr = atr(data.H1, 14) ?? entry * 0.001;
  let stopLoss: number;
  let takeProfit: number;
  if (decision === "BUY") {
    stopLoss = entry - h1Atr * 1.5;
    takeProfit = entry + h1Atr * 3;
  } else if (decision === "SELL") {
    stopLoss = entry + h1Atr * 1.5;
    takeProfit = entry - h1Atr * 3;
  } else {
    stopLoss = entry - h1Atr * 1.5;
    takeProfit = entry + h1Atr * 1.5;
  }
  const riskReward =
    decision === "HOLD" ? 1 : Math.abs(takeProfit - entry) / Math.abs(entry - stopLoss);

  const generatedAt = Date.now();
  return {
    pair,
    decision,
    confidence,
    entry,
    stopLoss,
    takeProfit,
    riskReward,
    generatedAt,
    expiresAt: generatedAt + LOCK_MS,
    timeframes,
    totalScore,
  };
}
