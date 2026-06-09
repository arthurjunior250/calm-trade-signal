import {
  Candle,
  ema,
  rsi,
  macd,
  atr,
  recentSupportResistance,
} from "./indicators";

export type Decision = "BUY" | "SELL" | "HOLD";

export interface IndicatorSnapshot {
  ema20: number | null;
  ema50: number | null;
  ema200: number | null;
  rsi: number | null;
  macd: { macd: number; signal: number; histogram: number; prevHistogram: number } | null;
  atr: number | null;
  support: number | null;
  resistance: number | null;
  lastClose: number;
  lastCandleTime: number;
}

export interface SignalReasoning {
  label: string;
  weight: number; // positive => bullish, negative => bearish
  detail: string;
}

export interface GeneratedSignal {
  pair: string;
  timeframe: "1h";
  decision: Decision;
  confidence: number; // 0..100
  entry: number;
  stopLoss: number;
  takeProfit: number;
  riskReward: number;
  generatedAt: number; // unix ms (signal-bar close time)
  expiresAt: number; // generatedAt + 30 min
  basedOnCandleTime: number; // unix sec of the last closed H1 candle
  indicators: IndicatorSnapshot;
  reasoning: SignalReasoning[];
}

const LOCK_MS = 30 * 60 * 1000;

export function analyzeCandles(closed: Candle[]): IndicatorSnapshot {
  const closes = closed.map((c) => c.close);
  const sr = recentSupportResistance(closed, 20);
  return {
    ema20: ema(closes, 20),
    ema50: ema(closes, 50),
    ema200: ema(closes, 200),
    rsi: rsi(closes, 14),
    macd: macd(closes),
    atr: atr(closed, 14),
    support: sr?.support ?? null,
    resistance: sr?.resistance ?? null,
    lastClose: closes[closes.length - 1],
    lastCandleTime: closed[closed.length - 1].time,
  };
}

export function generateSignal(pair: string, closed: Candle[]): GeneratedSignal {
  const ind = analyzeCandles(closed);
  const reasoning: SignalReasoning[] = [];

  // Scoring system (weights roughly proportional to the spec)
  // Trend: 30, Momentum (RSI + MACD): 25 + 15, S/R: 15, Pattern: 15
  let score = 0;

  // Trend via EMA stack
  if (ind.ema50 != null && ind.ema200 != null) {
    if (ind.ema50 > ind.ema200 && ind.lastClose > ind.ema50) {
      score += 30;
      reasoning.push({
        label: "Trend",
        weight: 30,
        detail: "Price above EMA50, EMA50 above EMA200 (bullish stack)",
      });
    } else if (ind.ema50 < ind.ema200 && ind.lastClose < ind.ema50) {
      score -= 30;
      reasoning.push({
        label: "Trend",
        weight: -30,
        detail: "Price below EMA50, EMA50 below EMA200 (bearish stack)",
      });
    } else {
      reasoning.push({
        label: "Trend",
        weight: 0,
        detail: "EMA stack mixed — no clear trend",
      });
    }
  }

  // RSI momentum
  if (ind.rsi != null) {
    if (ind.rsi > 55 && ind.rsi < 70) {
      score += 15;
      reasoning.push({
        label: "RSI",
        weight: 15,
        detail: `RSI ${ind.rsi.toFixed(1)} — bullish momentum, not overbought`,
      });
    } else if (ind.rsi < 45 && ind.rsi > 30) {
      score -= 15;
      reasoning.push({
        label: "RSI",
        weight: -15,
        detail: `RSI ${ind.rsi.toFixed(1)} — bearish momentum, not oversold`,
      });
    } else if (ind.rsi >= 70) {
      score -= 5;
      reasoning.push({
        label: "RSI",
        weight: -5,
        detail: `RSI ${ind.rsi.toFixed(1)} — overbought, reversal risk`,
      });
    } else if (ind.rsi <= 30) {
      score += 5;
      reasoning.push({
        label: "RSI",
        weight: 5,
        detail: `RSI ${ind.rsi.toFixed(1)} — oversold, bounce possible`,
      });
    } else {
      reasoning.push({
        label: "RSI",
        weight: 0,
        detail: `RSI ${ind.rsi.toFixed(1)} — neutral`,
      });
    }
  }

  // MACD
  if (ind.macd) {
    const bullishCross = ind.macd.histogram > 0 && ind.macd.prevHistogram <= 0;
    const bearishCross = ind.macd.histogram < 0 && ind.macd.prevHistogram >= 0;
    if (bullishCross) {
      score += 20;
      reasoning.push({ label: "MACD", weight: 20, detail: "Fresh bullish crossover" });
    } else if (bearishCross) {
      score -= 20;
      reasoning.push({ label: "MACD", weight: -20, detail: "Fresh bearish crossover" });
    } else if (ind.macd.histogram > 0) {
      score += 10;
      reasoning.push({ label: "MACD", weight: 10, detail: "Histogram positive" });
    } else if (ind.macd.histogram < 0) {
      score -= 10;
      reasoning.push({ label: "MACD", weight: -10, detail: "Histogram negative" });
    }
  }

  // Support / Resistance proximity
  if (ind.support != null && ind.resistance != null) {
    const range = ind.resistance - ind.support;
    if (range > 0) {
      const distToSupport = (ind.lastClose - ind.support) / range;
      if (distToSupport < 0.2) {
        score += 15;
        reasoning.push({
          label: "S/R",
          weight: 15,
          detail: "Price holding near support — buy zone",
        });
      } else if (distToSupport > 0.8) {
        score -= 15;
        reasoning.push({
          label: "S/R",
          weight: -15,
          detail: "Price near resistance — sell zone",
        });
      } else {
        reasoning.push({
          label: "S/R",
          weight: 0,
          detail: "Price mid-range",
        });
      }
    }
  }

  // Candlestick pattern on last bar
  const last = closed[closed.length - 1];
  const prev = closed[closed.length - 2];
  if (last && prev) {
    const body = Math.abs(last.close - last.open);
    const prevBody = Math.abs(prev.close - prev.open);
    // Bullish engulfing
    if (
      prev.close < prev.open &&
      last.close > last.open &&
      last.close > prev.open &&
      last.open < prev.close &&
      body > prevBody
    ) {
      score += 15;
      reasoning.push({ label: "Pattern", weight: 15, detail: "Bullish engulfing candle" });
    } else if (
      prev.close > prev.open &&
      last.close < last.open &&
      last.open > prev.close &&
      last.close < prev.open &&
      body > prevBody
    ) {
      score -= 15;
      reasoning.push({ label: "Pattern", weight: -15, detail: "Bearish engulfing candle" });
    } else {
      // Pin bar detection
      const range = last.high - last.low;
      const upperWick = last.high - Math.max(last.open, last.close);
      const lowerWick = Math.min(last.open, last.close) - last.low;
      if (range > 0 && lowerWick / range > 0.6) {
        score += 8;
        reasoning.push({ label: "Pattern", weight: 8, detail: "Bullish pin bar (long lower wick)" });
      } else if (range > 0 && upperWick / range > 0.6) {
        score -= 8;
        reasoning.push({ label: "Pattern", weight: -8, detail: "Bearish pin bar (long upper wick)" });
      }
    }
  }

  // Decision thresholds
  let decision: Decision = "HOLD";
  if (score >= 30) decision = "BUY";
  else if (score <= -30) decision = "SELL";

  const confidence = Math.min(100, Math.round((Math.abs(score) / 100) * 100));

  // Entry/SL/TP based on ATR
  const entry = ind.lastClose;
  const atrVal = ind.atr ?? entry * 0.001;
  let stopLoss: number;
  let takeProfit: number;
  if (decision === "BUY") {
    stopLoss = entry - atrVal * 1.5;
    takeProfit = entry + atrVal * 3;
  } else if (decision === "SELL") {
    stopLoss = entry + atrVal * 1.5;
    takeProfit = entry - atrVal * 3;
  } else {
    stopLoss = entry - atrVal * 1.5;
    takeProfit = entry + atrVal * 1.5;
  }
  const riskReward =
    decision === "HOLD"
      ? 1
      : Math.abs(takeProfit - entry) / Math.abs(entry - stopLoss);

  const generatedAt = last.time * 1000 + 60 * 60 * 1000; // close time of last H1 candle
  return {
    pair,
    timeframe: "1h",
    decision,
    confidence,
    entry,
    stopLoss,
    takeProfit,
    riskReward,
    generatedAt,
    expiresAt: generatedAt + LOCK_MS,
    basedOnCandleTime: last.time,
    indicators: ind,
    reasoning,
  };
}

export const LOCK_DURATION_MS = LOCK_MS;
