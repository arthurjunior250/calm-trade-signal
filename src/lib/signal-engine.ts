import { ema, rsi, macd, atr } from "./indicators";
import type { Candle } from "./indicators";
import type { Timeframe, TimeframeCandles } from "./market-data";
import { computeEdgeScore, type EdgeReport } from "./edge-score";

export type Decision = "BUY" | "SELL" | "HOLD";

const LOCK_MS = 10 * 60 * 1000;
export const LOCK_DURATION_MS = LOCK_MS;

const TF_WEIGHT: Record<Timeframe, number> = {
  MN: 5, W1: 8, D1: 12, H4: 15, H1: 20, M30: 15, M15: 15, M1: 10,
};

export interface TimeframeAnalysis {
  tf: Timeframe;
  weight: number;
  bias: -1 | 0 | 1;
  strength: number;
  score: number;
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
  confidence: number;
  confidenceLabel: EdgeReport["confidenceLabel"];
  entry: number;
  stopLoss: number;
  takeProfit: number;
  riskReward: number;
  generatedAt: number;
  expiresAt: number;
  timeframes: TimeframeAnalysis[];
  totalScore: number;
  edge: EdgeReport;
}

function analyzeOneTf(tf: Timeframe, weight: number, candles: Candle[]): TimeframeAnalysis {
  const closes = candles.map((c) => c.close);
  const last = closes[closes.length - 1] ?? 0;
  const e20 = ema(closes, 20);
  const e50 = ema(closes, 50);
  const r = rsi(closes, 14);
  const m = macd(closes);
  if (!candles.length) {
    return { tf, weight, bias: 0, strength: 0, score: 0, close: 0, ema20: null, ema50: null, rsi: null, macdHist: null, note: "No data" };
  }
  const votes: number[] = [];
  if (e20 != null && e50 != null) {
    if (last > e20 && e20 > e50) votes.push(1);
    else if (last < e20 && e20 < e50) votes.push(-1);
    else votes.push(0);
  }
  if (r != null) {
    if (r > 55 && r < 75) votes.push(1);
    else if (r < 45 && r > 25) votes.push(-1);
    else votes.push(0);
  }
  if (m) {
    if (m.histogram > 0) votes.push(1);
    else if (m.histogram < 0) votes.push(-1);
    else votes.push(0);
  }
  let bias: -1 | 0 | 1 = 0;
  let strength = 0;
  if (votes.length) {
    const sum = votes.reduce((a, b) => a + b, 0);
    const avg = sum / votes.length;
    if (avg > 0.2) bias = 1;
    else if (avg < -0.2) bias = -1;
    strength = Math.abs(avg);
  }
  const score = weight * bias * strength;
  const note = bias === 1 ? "Bullish" : bias === -1 ? "Bearish" : "Neutral";
  return { tf, weight, bias, strength, score, close: last, ema20: e20, ema50: e50, rsi: r, macdHist: m?.histogram ?? null, note };
}

export function generateSignal(pair: string, data: TimeframeCandles): GeneratedSignal {
  const timeframes: TimeframeAnalysis[] = (Object.keys(TF_WEIGHT) as Timeframe[]).map(
    (tf) => analyzeOneTf(tf, TF_WEIGHT[tf], data[tf] ?? []),
  );
  const totalScore = timeframes.reduce((a, t) => a + t.score, 0);

  // Edge Score is the authoritative decision input.
  const edge = computeEdgeScore(data.H1 ?? []);

  let decision: Decision = "HOLD";
  if (edge.total >= 55 && edge.dominant === "bull") decision = "BUY";
  else if (edge.total >= 55 && edge.dominant === "bear") decision = "SELL";

  const confidence = edge.total;

  const liveCandles =
    data.M1.length ? data.M1 : data.M15.length ? data.M15 : data.M30.length ? data.M30 : data.H1;
  const entry = liveCandles[liveCandles.length - 1].close;
  const h1Atr = atr(data.H1, 14) ?? entry * 0.001;
  let stopLoss: number, takeProfit: number;
  if (decision === "BUY") {
    stopLoss = entry - h1Atr * 1.5;
    takeProfit = entry + h1Atr * 3.75; // RR 1:2.5
  } else if (decision === "SELL") {
    stopLoss = entry + h1Atr * 1.5;
    takeProfit = entry - h1Atr * 3.75;
  } else {
    stopLoss = entry - h1Atr * 1.5;
    takeProfit = entry + h1Atr * 1.5;
  }
  const riskReward =
    decision === "HOLD" ? 1 : Math.abs(takeProfit - entry) / Math.abs(entry - stopLoss);

  const generatedAt = Date.now();
  return {
    pair, decision, confidence, confidenceLabel: edge.confidenceLabel,
    entry, stopLoss, takeProfit, riskReward,
    generatedAt, expiresAt: generatedAt + LOCK_MS,
    timeframes, totalScore, edge,
  };
}
