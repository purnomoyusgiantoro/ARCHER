// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ATRResult {
  value: number;
  pct: number;
  label: string;
  level: 'high' | 'medium' | 'low';
}

export interface TrendStrength {
  score: number;
  label: string;
  direction: 'bull' | 'bear' | 'neutral';
}

export interface LiquidityZones {
  resistance: number | null;
  support: number | null;
  resistanceCount: number;
  supportCount: number;
}

export interface SmartMoney {
  signal: string;
  description: string;
  bias: 'bull' | 'bear' | 'neutral';
}

export interface FakeBreakout {
  signal: string;
  description: string;
  bias: 'bull' | 'bear' | 'neutral';
}

export interface MarketAnalysis {
  currentPrice: number;
  rsi: number;
  ema: number;
  status: string;
  signal: string;
  projectionDay: string;
  projectionWeek: string;
  projectionMonth: string;
  targetHigh: number;
  targetLow: number;
  entryRange: { min: number; max: number };
  stopLoss: number;
  confidence: number;
  liquidity: {
    top: { start: number; end: number };
    bottom: { start: number; end: number };
  };
  atr: ATRResult | null;
  trendStrength: TrendStrength;
  liquidityZones: LiquidityZones | null;
  smartMoney: SmartMoney | null;
  fakeBreakout: FakeBreakout | null;
  volumeAnalysis: {
    relativeVolume: number;
    trend: 'increasing' | 'decreasing' | 'stable';
    signal: string;
  } | null;
  marketStructure: {
    lastStructure: 'BOS' | 'CHoCH' | 'NONE';
    direction: 'bullish' | 'bearish' | 'neutral';
    description: string;
  } | null;
  riskReward: {
    ratio: number;
    isValid: boolean;
    description: string;
  } | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Validasi & Utils
// ─────────────────────────────────────────────────────────────────────────────

const validatePrices = (prices: [number, number][]): [number, number][] => {
  if (!Array.isArray(prices)) return [];
  return prices.filter(
    p => Array.isArray(p) && p.length >= 2 && typeof p[1] === 'number' && isFinite(p[1])
  );
};

const emaFromCloses = (closes: number[], period: number): number | null => {
  if (!closes || closes.length === 0) return null;
  const effective = Math.min(period, closes.length);
  let ema = closes.slice(0, effective).reduce((s, v) => s + v, 0) / effective;
  const mult = 2 / (period + 1);
  for (let i = effective; i < closes.length; i++) {
    ema = (closes[i] - ema) * mult + ema;
  }
  return ema;
};

// ─────────────────────────────────────────────────────────────────────────────
// Jakarta Time Helpers
// ─────────────────────────────────────────────────────────────────────────────

export const getJakartaTime = (date = new Date()) => {
  return new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

// ─────────────────────────────────────────────────────────────────────────────
// Indikator Dasar
// ─────────────────────────────────────────────────────────────────────────────

export const calculateRSI = (prices: [number, number][], period = 14): number | null => {
  const valid = validatePrices(prices);
  if (valid.length <= period) return null;
  const closes = valid.map(p => p[1]);
  let gains = 0, losses = 0;
  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }
  let avgGain = gains / period;
  let avgLoss = losses / period;
  for (let i = period + 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) {
      avgGain = ((avgGain * (period - 1)) + diff) / period;
      avgLoss = (avgLoss * (period - 1)) / period;
    } else {
      avgGain = (avgGain * (period - 1)) / period;
      avgLoss = ((avgLoss * (period - 1)) - diff) / period;
    }
  }
  if (avgGain === 0 && avgLoss === 0) return 50;
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return Math.round((100 - (100 / (1 + rs))) * 100) / 100;
};

export const calculateEMA = (prices: [number, number][], period = 200): number | null => {
  const valid = validatePrices(prices);
  if (valid.length === 0) return null;
  return emaFromCloses(valid.map(p => p[1]), period);
};

export const calculateATR = (prices: [number, number][], period = 14): ATRResult | null => {
  const valid = validatePrices(prices);
  if (valid.length < period + 1) return null;
  const closes = valid.map(p => p[1]);
  const trValues = [];
  for (let i = 1; i < closes.length; i++) {
    trValues.push(Math.abs(closes[i] - closes[i - 1]));
  }
  const recent = trValues.slice(-period);
  const atr = recent.reduce((s, v) => s + v, 0) / recent.length;
  const currentPrice = closes[closes.length - 1];
  const atrPct = (atr / currentPrice) * 100;

  let label: string, level: 'high' | 'medium' | 'low';
  if (atrPct > 3) { label = 'VOLATILITAS TINGGI'; level = 'high'; }
  else if (atrPct > 1) { label = 'VOLATILITAS NORMAL'; level = 'medium'; }
  else { label = 'VOLATILITAS RENDAH'; level = 'low'; }

  return { value: atr, pct: atrPct, label, level };
};

// ─────────────────────────────────────────────────────────────────────────────
// Analisis Lanjutan
// ─────────────────────────────────────────────────────────────────────────────

export const calculateTrendStrength = (prices: [number, number][]): TrendStrength => {
  const valid = validatePrices(prices);
  if (valid.length < 20) return { score: 0, label: 'DATA KURANG', direction: 'neutral' };
  const closes = valid.map(p => p[1]);
  const currentPrice = closes[closes.length - 1];
  const ema20 = emaFromCloses(closes, 20);
  const ema50 = emaFromCloses(closes, 50);
  const ema200 = emaFromCloses(closes, 200);
  let score = 0;
  if (ema20 && currentPrice > ema20) score += 20;
  if (ema50 && currentPrice > ema50) score += 20;
  if (ema200 && currentPrice > ema200) score += 20;
  if (ema20 && ema50 && ema20 > ema50) score += 20;
  if (ema50 && ema200 && ema50 > ema200) score += 20;

  let label: string, direction: 'bull' | 'bear' | 'neutral';
  if (score >= 80) { label = 'SANGAT KUAT BULLISH'; direction = 'bull'; }
  else if (score >= 60) { label = 'BULLISH'; direction = 'bull'; }
  else if (score >= 40) { label = 'NETRAL'; direction = 'neutral'; }
  else if (score >= 20) { label = 'BEARISH'; direction = 'bear'; }
  else { label = 'SANGAT KUAT BEARISH'; direction = 'bear'; }
  return { score, label, direction };
};

export const calculateVolumeAnalysis = (volumes: [number, number][]) => {
  if (volumes.length < 20) return null;
  const values = volumes.map(v => v[1]);
  const recentVolume = values[values.length - 1];
  const avgVolume = values.slice(-20).reduce((s, v) => s + v, 0) / 20;
  const relVol = recentVolume / avgVolume;
  let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
  if (recentVolume > values[values.length - 2]) trend = 'increasing';
  else if (recentVolume < values[values.length - 2]) trend = 'decreasing';
  let signal = relVol > 1.5 ? 'Volume Meningkat' : 'Normal';
  return { relativeVolume: Math.round(relVol * 100) / 100, trend, signal };
};

export const detectMarketStructure = (ohlc: [number, number, number, number, number][]): {
  lastStructure: 'BOS' | 'CHoCH' | 'NONE';
  direction: 'bullish' | 'bearish' | 'neutral';
  description: string;
} => {
  if (ohlc.length < 20) return { lastStructure: 'NONE', direction: 'neutral', description: 'Data tidak cukup untuk analisis struktur' };
  
  const recent = ohlc.slice(-20);
  const last = recent[recent.length - 1];
  const prev = recent[recent.length - 2];
  
  const highs = ohlc.map(d => d[2]);
  const lows = ohlc.map(d => d[3]);

  // Find significant swing points
  const window = 5;
  const swingHighs: number[] = [];
  const swingLows: number[] = [];
  
  for (let i = window; i < highs.length - window; i++) {
    if (highs[i] === Math.max(...highs.slice(i - window, i + window + 1))) swingHighs.push(highs[i]);
    if (lows[i] === Math.min(...lows.slice(i - window, i + window + 1))) swingLows.push(lows[i]);
  }

  const lastSwingHigh = swingHighs[swingHighs.length - 1] || Math.max(...highs.slice(-10, -1));
  const lastSwingLow = swingLows[swingLows.length - 1] || Math.min(...lows.slice(-10, -1));
  
  let lastStructure: 'BOS' | 'CHoCH' | 'NONE' = 'NONE';
  let direction: 'bullish' | 'bearish' | 'neutral' = 'neutral';
  let description = 'Market sedang bergerak sideways atau konsolidasi';

  const currentClose = last[4];

  if (currentClose > lastSwingHigh) {
    lastStructure = 'BOS';
    direction = 'bullish';
    description = 'Break of Structure ke atas - Konfirmasi penguatan tren naik';
  } else if (currentClose < lastSwingLow) {
    lastStructure = 'BOS';
    direction = 'bearish';
    description = 'Break of Structure ke bawah - Konfirmasi penguatan tren turun';
  } 
  else if (prev[4] < lastSwingLow && currentClose > lastSwingLow) {
    lastStructure = 'CHoCH';
    direction = 'bullish';
    description = 'Change of Character - Potensi pembalikan arah menjadi bullish';
  } else if (prev[4] > lastSwingHigh && currentClose < lastSwingHigh) {
    lastStructure = 'CHoCH';
    direction = 'bearish';
    description = 'Change of Character - Potensi pembalikan arah menjadi bearish';
  }

  return { lastStructure, direction, description };
};

export const detectSmartMoney = (prices: [number, number][]): SmartMoney => {
  const valid = validatePrices(prices);
  if (valid.length < 20) return { signal: 'DATA KURANG', description: 'Butuh lebih banyak data untuk konfirmasi.', bias: 'neutral' };
  const closes = valid.map(p => p[1]);
  const recent = closes.slice(-40);
  const w = 2;
  const highs: number[] = [], lows: number[] = [];
  for (let i = w; i < recent.length - w; i++) {
    const sl = recent.slice(i - w, i + w + 1);
    if (recent[i] === Math.max(...sl)) highs.push(recent[i]);
    if (recent[i] === Math.min(...sl)) lows.push(recent[i]);
  }
  if (highs.length < 2 || lows.length < 2) return { signal: 'MEMINDAI', description: 'Sedang memindai struktur swing...', bias: 'neutral' };
  const lastHighs = highs.slice(-2), lastLows = lows.slice(-2);
  const hh = lastHighs[1] > lastHighs[0], hl = lastLows[1] > lastLows[0];
  const lh = lastHighs[1] < lastHighs[0], ll = lastLows[1] < lastLows[0];
  if (hh && hl) return { signal: 'AKUMULASI', description: 'HH & HL — Institusi melakukan akumulasi beli.', bias: 'bull' };
  if (lh && ll) return { signal: 'DISTRIBUSI', description: 'LH & LL — Institusi melakukan distribusi jual.', bias: 'bear' };
  return { signal: 'TIDAK JELAS', description: 'Pola swing tidak konsisten.', bias: 'neutral' };
};

export const detectFakeBreakout = (prices: [number, number][]): FakeBreakout => {
  const valid = validatePrices(prices);
  if (valid.length < 15) return { signal: 'DATA KURANG', description: 'Butuh data untuk menentukan range.', bias: 'neutral' };
  const closes = valid.map(p => p[1]);
  const lookback = 20;
  const rangeData = closes.slice(-lookback - 2, -2);
  const current = closes[closes.length - 1];
  const rangeHigh = Math.max(...rangeData), rangeLow = Math.min(...rangeData);
  const atrResult = calculateATR(valid, 14);
  const threshold = (atrResult ? atrResult.value : (rangeHigh - rangeLow) * 0.1) * 0.3;
  if (current > rangeHigh + threshold) return { signal: 'BREAKOUT VALID', description: 'Harga menembus resistance dengan kuat.', bias: 'bull' };
  if (current < rangeLow - threshold) return { signal: 'BREAKDOWN VALID', description: 'Harga menembus support dengan kuat.', bias: 'bear' };
  return { signal: 'DALAM RANGE', description: 'Harga masih bergerak dalam area konsolidasi.', bias: 'neutral' };
};

export const detectRealLiquidityZones = (prices: [number, number][]): LiquidityZones => {
  const valid = validatePrices(prices);
  if (valid.length < 20) return { resistance: null, support: null, resistanceCount: 0, supportCount: 0 };
  const lookback = Math.min(valid.length, 120);
  const recent = valid.slice(-lookback).map(p => p[1]);
  const window = 3;
  const localMaxima: number[] = [];
  const localMinima: number[] = [];
  for (let i = window; i < recent.length - window; i++) {
    const slice = recent.slice(i - window, i + window + 1);
    const max = Math.max(...slice);
    const min = Math.min(...slice);
    if (recent[i] === max) localMaxima.push(recent[i]);
    if (recent[i] === min) localMinima.push(recent[i]);
  }
  const groupLevels = (levels: number[]) => {
    if (levels.length === 0) return { price: null, count: 0 };
    const sorted = [...levels].sort((a, b) => a - b);
    const groups = [];
    let current = [sorted[0]];
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] / current[0] < 1.015) current.push(sorted[i]);
      else {
        groups.push({ price: Math.round(current.reduce((s, v) => s + v, 0) / current.length), count: current.length });
        current = [sorted[i]];
      }
    }
    groups.push({ price: Math.round(current.reduce((s, v) => s + v, 0) / current.length), count: current.length });
    const top = groups.sort((a, b) => b.count - a.count)[0];
    return top || { price: null, count: 0 };
  };
  const resistance = groupLevels(localMaxima);
  const support = groupLevels(localMinima);
  return { resistance: resistance.price, support: support.price, resistanceCount: resistance.count, supportCount: support.count };
};

// ─────────────────────────────────────────────────────────────────────────────
// LOGIKA ENTRY, SL, DAN TP (PERBAIKAN UTAMA)
// ─────────────────────────────────────────────────────────────────────────────

export const validateRiskReward = (entry: number, target: number, stopLoss: number) => {
  const risk = Math.abs(entry - stopLoss);
  const reward = Math.abs(target - entry);
  if (risk === 0) return { ratio: 0, isValid: false, description: 'Risk Tidak Valid' };
  const ratio = reward / risk;
  const isValid = ratio >= 2.0;
  return {
    ratio: Math.round(ratio * 100) / 100,
    isValid,
    description: isValid ? 'RR Bagus (>= 1:2)' : 'RR Buruk (< 1:2)'
  };
};

export const calculateTradeMetrics = (prices: [number, number][], rsi: number | null, currentPrice: number, ema: number | null) => {
  const valid = validatePrices(prices);
  if (valid.length < 30) return { targetHigh: 0, targetLow: 0, entryRange: { min: 0, max: 0 }, stopLoss: 0, confidence: 0, riskReward: null };

  const onlyPrices = valid.map(p => p[1]);
  const recentHigh = Math.max(...onlyPrices.slice(-30));
  const recentLow = Math.min(...onlyPrices.slice(-30));
  const atrRes = calculateATR(valid, 14);
  const atr = atrRes ? atrRes.value : currentPrice * 0.01;
  const isUptrend = ema ? currentPrice > ema : true;

  let entryMin, entryMax, stopLoss, targetPrice;
  const buffer = atr * 0.5;

  if (isUptrend) {
    entryMax = currentPrice;
    entryMin = currentPrice - (atr * 0.3);
    stopLoss = recentLow - buffer;
    const risk = ((entryMin + entryMax) / 2) - stopLoss;
    targetPrice = ((entryMin + entryMax) / 2) + (risk * 2.5);
  } else {
    entryMin = currentPrice;
    entryMax = currentPrice + (atr * 0.3);
    stopLoss = recentHigh + buffer;
    const risk = stopLoss - ((entryMin + entryMax) / 2);
    targetPrice = ((entryMin + entryMax) / 2) - (risk * 2.5);
  }

  const rr = validateRiskReward((entryMin + entryMax) / 2, targetPrice, stopLoss);

  let score = 60;
  if (rsi) {
    if (isUptrend && rsi < 45) score += 15;
    if (!isUptrend && rsi > 55) score += 15;
  }
  if (rr.isValid) score += 10;

  return {
    targetHigh: isUptrend ? Math.round(targetPrice) : Math.round(recentHigh),
    targetLow: !isUptrend ? Math.round(targetPrice) : Math.round(recentLow),
    entryRange: { min: Math.round(entryMin), max: Math.round(entryMax) },
    stopLoss: Math.round(stopLoss),
    confidence: Math.min(95, score),
    riskReward: rr
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// Analisis Lengkap
// ─────────────────────────────────────────────────────────────────────────────

export const analyzeMarket = (
  prices: [number, number][],
  volumes: [number, number][],
  ohlc: [number, number, number, number, number][]
): MarketAnalysis => {
  const valid = validatePrices(prices);
  const currentPrice = valid.length > 0 ? valid[valid.length - 1][1] : 0;
  const rsi = calculateRSI(valid, 14);
  const ema = calculateEMA(valid, 200);
  const metrics = calculateTradeMetrics(valid, rsi, currentPrice, ema);
  const volAnalysis = calculateVolumeAnalysis(volumes);
  const structure = detectMarketStructure(ohlc);
  const smartMoney = detectSmartMoney(valid);
  const fakeBreakout = detectFakeBreakout(valid);
  const liquidityZones = detectRealLiquidityZones(valid);

  // Final Signal Logic
  let status = 'NETRAL';
  let signal = 'Wait & See';
  if (currentPrice > (ema ?? 0) && (rsi ?? 50) < 60) {
    status = 'BULLISH';
    signal = 'BUY (Pullback)';
  } else if (currentPrice < (ema ?? 0) && (rsi ?? 50) > 40) {
    status = 'BEARISH';
    signal = 'SELL (Pullback)';
  }

  // Adjust confidence based on multiple factors
  let finalConfidence = metrics.confidence;
  if (volAnalysis && volAnalysis.trend === 'increasing') finalConfidence += 5;
  if (structure.lastStructure !== 'NONE') finalConfidence += 5;
  if (smartMoney.bias !== 'neutral') finalConfidence += 5;
  if (fakeBreakout.signal.includes('VALID')) finalConfidence += 10;

  return {
    currentPrice,
    rsi: rsi ?? 50,
    ema: ema ?? currentPrice,
    status,
    signal,
    projectionDay: 'Berdasarkan volume dan struktur saat ini.',
    projectionWeek: 'Tren makro mengikuti EMA 200.',
    projectionMonth: 'Konsolidasi di area supply/demand.',
    targetHigh: metrics.targetHigh,
    targetLow: metrics.targetLow,
    entryRange: metrics.entryRange,
    stopLoss: metrics.stopLoss,
    confidence: Math.min(95, finalConfidence),
    liquidity: {
      top: { start: metrics.targetHigh * 0.99, end: metrics.targetHigh },
      bottom: { start: metrics.stopLoss, end: metrics.stopLoss * 1.01 }
    },
    atr: calculateATR(valid, 14),
    trendStrength: calculateTrendStrength(valid),
    liquidityZones,
    smartMoney,
    fakeBreakout,
    volumeAnalysis: volAnalysis,
    marketStructure: structure,
    riskReward: metrics.riskReward
  };
};
