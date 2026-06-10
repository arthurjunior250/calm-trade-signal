import { T as TSS_SERVER_FUNCTION, a as createServerFn } from "./server-BwKqoyDR.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const PAIRS = [{
  value: "EUR/USD",
  label: "EUR/USD",
  yahoo: "EURUSD=X"
}, {
  value: "GBP/USD",
  label: "GBP/USD",
  yahoo: "GBPUSD=X"
}, {
  value: "USD/JPY",
  label: "USD/JPY",
  yahoo: "USDJPY=X"
}, {
  value: "GBP/JPY",
  label: "GBP/JPY",
  yahoo: "GBPJPY=X"
}, {
  value: "XAU/USD",
  label: "XAU/USD (Gold)",
  yahoo: "GC=F"
}];
const TF_CONFIG = {
  MN: {
    interval: "1mo",
    range: "10y",
    intervalSec: 30 * 86400
  },
  W1: {
    interval: "1wk",
    range: "5y",
    intervalSec: 7 * 86400
  },
  D1: {
    interval: "1d",
    range: "2y",
    intervalSec: 86400
  },
  H1: {
    interval: "1h",
    range: "60d",
    intervalSec: 3600
  },
  M30: {
    interval: "30m",
    range: "30d",
    intervalSec: 1800
  },
  M15: {
    interval: "15m",
    range: "15d",
    intervalSec: 900
  },
  M1: {
    interval: "1m",
    range: "5d",
    intervalSec: 60
  }
};
function yahooSymbol(pair) {
  const p = PAIRS.find((x) => x.value === pair);
  if (!p) throw new Error(`Unknown pair: ${pair}`);
  return p.yahoo;
}
async function fetchYahoo(symbol, interval, range) {
  const url = new URL(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}`);
  url.searchParams.set("interval", interval);
  url.searchParams.set("range", range);
  const res = await fetch(url.toString(), {
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  });
  if (!res.ok) {
    throw new Error(`Yahoo ${interval} failed: ${res.status}`);
  }
  const json = await res.json();
  if (json.chart?.error) {
    throw new Error(json.chart.error.description ?? "Yahoo error");
  }
  const result = json.chart?.result?.[0];
  const ts = result?.timestamp ?? [];
  const q = result?.indicators?.quote?.[0];
  if (!q || !ts.length) return [];
  const candles = [];
  for (let i = 0; i < ts.length; i++) {
    const o = q.open?.[i];
    const h = q.high?.[i];
    const l = q.low?.[i];
    const c = q.close?.[i];
    if (o == null || h == null || l == null || c == null) continue;
    candles.push({
      time: ts[i],
      open: o,
      high: h,
      low: l,
      close: c
    });
  }
  candles.sort((a, b) => a.time - b.time);
  return candles;
}
function dropForming(candles, intervalSec) {
  const nowSec = Math.floor(Date.now() / 1e3);
  return candles.filter((c) => c.time + intervalSec <= nowSec + 1);
}
function aggregateH4(h1) {
  const buckets = /* @__PURE__ */ new Map();
  for (const c of h1) {
    const bucketStart = c.time - c.time % (4 * 3600);
    const arr = buckets.get(bucketStart) ?? [];
    arr.push(c);
    buckets.set(bucketStart, arr);
  }
  const out = [];
  for (const [start, arr] of buckets) {
    arr.sort((a, b) => a.time - b.time);
    out.push({
      time: start,
      open: arr[0].open,
      high: Math.max(...arr.map((x) => x.high)),
      low: Math.min(...arr.map((x) => x.low)),
      close: arr[arr.length - 1].close
    });
  }
  out.sort((a, b) => a.time - b.time);
  return out;
}
const fetchAllTimeframesFn_createServerFn_handler = createServerRpc({
  id: "bdc12cfac863d3cdd2a1989926c1047340bb6ca839acfa0b7000ead3a7fbf3b2",
  name: "fetchAllTimeframesFn",
  filename: "src/lib/market-data.ts"
}, (opts) => fetchAllTimeframesFn.__executeServer(opts));
const fetchAllTimeframesFn = createServerFn({
  method: "GET"
}).inputValidator(objectType({
  pair: stringType()
})).handler(fetchAllTimeframesFn_createServerFn_handler, async ({
  data
}) => {
  const symbol = yahooSymbol(data.pair);
  const entries = await Promise.all(Object.keys(TF_CONFIG).map(async (tf) => {
    const cfg = TF_CONFIG[tf];
    try {
      const raw = await fetchYahoo(symbol, cfg.interval, cfg.range);
      return [tf, dropForming(raw, cfg.intervalSec)];
    } catch {
      return [tf, []];
    }
  }));
  const map = Object.fromEntries(entries);
  const h4 = aggregateH4(map.H1);
  const nowSec = Math.floor(Date.now() / 1e3);
  const h4Closed = h4.filter((c) => c.time + 4 * 3600 <= nowSec + 1);
  return {
    ...map,
    H4: h4Closed
  };
});
export {
  fetchAllTimeframesFn_createServerFn_handler
};
