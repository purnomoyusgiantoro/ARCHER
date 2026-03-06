// ─────────────────────────────────────────────────────────────────────────────
// Validasi & Utils
// ─────────────────────────────────────────────────────────────────────────────

const validatePrices = (prices) => {
  if (!Array.isArray(prices)) return [];
  return prices.filter(
    p => Array.isArray(p) && p.length >= 2 && typeof p[1] === 'number' && isFinite(p[1])
  );
};

// Hitung EMA dari array close prices (number[])
const emaFromCloses = (closes, period) => {
  if (!closes || closes.length < period) return null;
  const effective = Math.min(period, Math.max(Math.floor(closes.length * 0.75), 2));
  let sum = 0;
  for (let i = 0; i < effective; i++) sum += closes[i];
  let ema = sum / effective;
  const mult = 2 / (effective + 1);
  for (let i = effective; i < closes.length; i++) {
    ema = (closes[i] - ema) * mult + ema;
  }
  return ema;
};

// ─────────────────────────────────────────────────────────────────────────────
// Indikator Dasar
// ─────────────────────────────────────────────────────────────────────────────

export const calculateRSI = (prices, period = 14) => {
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

  if (avgGain === 0 && avgLoss === 0) return 50; // Tidak ada pergerakan → netral
  if (avgLoss === 0) return 100;

  const rs = avgGain / avgLoss;
  return Math.round((100 - (100 / (1 + rs))) * 100) / 100;
};

export const calculateEMA = (prices, period = 200) => {
  const valid = validatePrices(prices);
  if (valid.length === 0) return null;
  return emaFromCloses(valid.map(p => p[1]), period);
};

// ─────────────────────────────────────────────────────────────────────────────
// ATR Volatility
// ─────────────────────────────────────────────────────────────────────────────

export const calculateATR = (prices, period = 14) => {
  const valid = validatePrices(prices);
  if (valid.length < period + 1) return null;

  const closes = valid.map(p => p[1]);
  const trValues = [];
  for (let i = 1; i < closes.length; i++) {
    trValues.push(Math.abs(closes[i] - closes[i - 1]));
  }

  const recent = trValues.slice(-period);
  const atr = recent.reduce((s, v) => s + v, 0) / recent.length;

  // Hitung rata-rata volatilitas sebelumnya untuk perbandingan
  const prev = trValues.slice(-period * 2, -period);
  const prevATR = prev.length > 0 ? prev.reduce((s, v) => s + v, 0) / prev.length : atr;

  const currentPrice = closes[closes.length - 1];
  const atrPct = (atr / currentPrice) * 100;

  let label, level;
  if (atrPct > 3) { label = 'VOLATILITAS TINGGI'; level = 'high'; }
  else if (atrPct > 1) { label = 'VOLATILITAS NORMAL'; level = 'medium'; }
  else { label = 'VOLATILITAS RENDAH'; level = 'low'; }

  const trend = atr > prevATR ? 'naik' : atr < prevATR ? 'turun' : 'stabil';

  return { value: atr, pct: atrPct, label, level, trend };
};

// ─────────────────────────────────────────────────────────────────────────────
// Real Liquidity Zone (Swing High/Low Clustering)
// ─────────────────────────────────────────────────────────────────────────────

export const detectRealLiquidityZones = (prices) => {
  const valid = validatePrices(prices);
  if (valid.length < 20) return { resistance: null, support: null, resistanceCount: 0, supportCount: 0 };

  const lookback = Math.min(valid.length, 120);
  const recent = valid.slice(-lookback).map(p => p[1]);
  const window = 3;

  const localMaxima = [];
  const localMinima = [];

  for (let i = window; i < recent.length - window; i++) {
    const slice = recent.slice(i - window, i + window + 1);
    if (recent[i] === Math.max(...slice)) localMaxima.push(recent[i]);
    if (recent[i] === Math.min(...slice)) localMinima.push(recent[i]);
  }

  const groupLevels = (levels) => {
    if (levels.length === 0) return { price: null, count: 0 };
    const sorted = [...levels].sort((a, b) => a - b);
    const groups = [];
    let current = [sorted[0]];

    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] / current[0] < 1.015) {
        current.push(sorted[i]);
      } else {
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

  return {
    resistance: resistance.price,
    support: support.price,
    resistanceCount: resistance.count,
    supportCount: support.count,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// Trend Strength (EMA Alignment Score)
// ─────────────────────────────────────────────────────────────────────────────

export const calculateTrendStrength = (prices) => {
  const valid = validatePrices(prices);
  if (valid.length < 20) return { score: 0, label: 'DATA KURANG', direction: 'neutral' };

  const closes = valid.map(p => p[1]);
  const currentPrice = closes[closes.length - 1];

  const ema20 = emaFromCloses(closes, Math.min(20, Math.floor(closes.length * 0.4)));
  const ema50 = emaFromCloses(closes, Math.min(50, Math.floor(closes.length * 0.6)));
  const ema200 = emaFromCloses(closes, 200);

  let score = 0;
  if (ema20 !== null && currentPrice > ema20) score += 20;
  if (ema50 !== null && currentPrice > ema50) score += 20;
  if (ema200 !== null && currentPrice > ema200) score += 20;
  if (ema20 !== null && ema50 !== null && ema20 > ema50) score += 20;
  if (ema50 !== null && ema200 !== null && ema50 > ema200) score += 20;

  let label, direction;
  if (score >= 80) { label = 'SANGAT KUAT BULLISH'; direction = 'bull'; }
  else if (score >= 60) { label = 'BULLISH'; direction = 'bull'; }
  else if (score >= 40) { label = 'NETRAL'; direction = 'neutral'; }
  else if (score >= 20) { label = 'BEARISH'; direction = 'bear'; }
  else { label = 'SANGAT KUAT BEARISH'; direction = 'bear'; }

  return { score, label, direction };
};

// ─────────────────────────────────────────────────────────────────────────────
// Smart Money Detection (Struktur HH/HL vs LH/LL)
// ─────────────────────────────────────────────────────────────────────────────

export const detectSmartMoney = (prices) => {
  const valid = validatePrices(prices);
  if (valid.length < 20) {
    return { signal: 'DATA KURANG', description: 'Butuh lebih banyak data untuk analisis struktural.', bias: 'neutral' };
  }

  const closes = valid.map(p => p[1]);
  const recent = closes.slice(-40);
  const w = 2;

  const highs = [];
  const lows = [];

  for (let i = w; i < recent.length - w; i++) {
    const sl = recent.slice(i - w, i + w + 1);
    if (recent[i] === Math.max(...sl)) highs.push(recent[i]);
    if (recent[i] === Math.min(...sl)) lows.push(recent[i]);
  }

  if (highs.length < 2 || lows.length < 2) {
    return { signal: 'MEMINDAI', description: 'Pivot belum cukup untuk deteksi pola Smart Money.', bias: 'neutral' };
  }

  const lastHighs = highs.slice(-2);
  const lastLows = lows.slice(-2);
  const hh = lastHighs[1] > lastHighs[0];
  const hl = lastLows[1] > lastLows[0];
  const lh = lastHighs[1] < lastHighs[0];
  const ll = lastLows[1] < lastLows[0];

  if (hh && hl) return { signal: 'AKUMULASI', description: 'Higher Highs & Higher Lows — Smart Money sedang mengumpulkan posisi Long.', bias: 'bull' };
  if (lh && ll) return { signal: 'DISTRIBUSI', description: 'Lower Highs & Lower Lows — Smart Money kemungkinan melepas posisi (distribusi).', bias: 'bear' };
  if (hl && lh) return { signal: 'SQUEEZE', description: 'Pola compression simetris — Smart Money menunggu breakout arah.', bias: 'neutral' };
  return { signal: 'TIDAK JELAS', description: 'Struktur pasar tanpa dominasi Smart Money yang jelas saat ini.', bias: 'neutral' };
};

// ─────────────────────────────────────────────────────────────────────────────
// Fake Breakout Filter
// ─────────────────────────────────────────────────────────────────────────────

export const detectFakeBreakout = (prices) => {
  const valid = validatePrices(prices);
  if (valid.length < 15) {
    return { signal: 'DATA KURANG', description: 'Butuh lebih banyak data untuk filter breakout.', bias: 'neutral' };
  }

  const closes = valid.map(p => p[1]);
  const lookback = Math.min(20, closes.length - 2);
  const rangeData = closes.slice(-lookback - 2, -2);
  const prevClose = closes[closes.length - 2];
  const current = closes[closes.length - 1];
  const rangeHigh = Math.max(...rangeData);
  const rangeLow = Math.min(...rangeData);

  const atrResult = calculateATR(valid, 14);
  const atr = atrResult ? atrResult.value : (rangeHigh - rangeLow) * 0.1;
  const threshold = atr * 0.3;

  if (prevClose > rangeHigh && current <= rangeHigh) {
    return { signal: 'BULL TRAP', description: 'Harga sempat menembus resistance namun gagal bertahan. Waspadai jebakan (false breakout).', bias: 'bear' };
  }
  if (prevClose < rangeLow && current >= rangeLow) {
    return { signal: 'BEAR TRAP', description: 'Harga sempat breakdown support namun kembali ke atas. Potensi reversal ke atas.', bias: 'bull' };
  }
  if (current > rangeHigh + threshold) {
    return { signal: 'BREAKOUT VALID', description: 'Harga berhasil menembus resistance dengan jarak aman dari ATR. Breakout terlihat valid.', bias: 'bull' };
  }
  if (current < rangeLow - threshold) {
    return { signal: 'BREAKDOWN VALID', description: 'Harga menembus support dengan konfirmasi ATR. Breakdown ke bawah terlihat valid.', bias: 'bear' };
  }
  return { signal: 'DALAM RANGE', description: 'Harga bergerak normal dalam range. Tidak ada breakout aktif yang perlu difilter saat ini.', bias: 'neutral' };
};

// ─────────────────────────────────────────────────────────────────────────────
// Analisis Sinyal & Proyeksi
// ─────────────────────────────────────────────────────────────────────────────

export const getMarketStructureSignal = (rsi, currentPrice, ema) => {
  if (rsi === null || rsi === undefined || ema === null || ema === undefined) {
    return { status: 'LOADING', signal: 'Memindai Data...' };
  }

  let status = 'NETRAL', signal = 'Tunggu Konfirmasi Pola/BOS';

  if (rsi < 35 && currentPrice < ema) { status = 'OVERSOLD EXTREME'; signal = 'Waspada Area Pembalikan Uptrend (Reversal)'; }
  else if (rsi < 40 && currentPrice >= ema) { status = 'KOREKSI WAJAR'; signal = 'Peluang Entry Pantulan EMA'; }
  else if (rsi > 70 && currentPrice > ema) { status = 'OVERBOUGHT EXTREME'; signal = 'Risiko Koreksi Tinggi (Distribusi)'; }
  else if (rsi > 60 && currentPrice < ema) { status = 'BEARISH BOUNCE'; signal = 'Pullback sementara di bawah EMA'; }
  else if (currentPrice > ema) { status = 'BULLISH (UPTREND)'; signal = 'Harga stabil di atas Rata-rata'; }
  else if (currentPrice < ema) { status = 'BEARISH (DOWNTREND)'; signal = 'Harga tertahan di bawah Rata-rata'; }

  return { status, signal };
};

export const generateTimeframePredictions = (rsi, currentPrice, ema) => {
  let predictionDay = 'Sinyal belum cukup jelas untuk hari ini.';
  let predictionWeek = 'Sinyal belum cukup jelas untuk struktur mingguan.';
  let predictionMonth = 'Sinyal belum cukup jelas untuk tren makro bulanan.';

  if (currentPrice > ema) {
    if (rsi > 70) {
      predictionDay = 'Risiko aksi ambil untung (Take Profit). Bisa turun menguji support terdekat.';
      predictionWeek = 'Kecenderungan koreksi sehat sebelum mencoba menembus level Resistance baru.';
      predictionMonth = 'Tren Bullish kuat. Distribusi bisa membuat pasar konsolidasi di rentang tinggi bulan ini.';
    } else if (rsi < 40) {
      predictionDay = 'Pantulan harga (Bounce) berpeluang terjadi dalam 24 jam ke depan di area rata-rata tren.';
      predictionWeek = 'Berpeluang kembali melanjutkan Uptrend setelah koreksi mereda.';
      predictionMonth = 'Peluang akumulasi terbaik bulan ini sebelum tren harga naik lebih lanjut.';
    } else {
      predictionDay = 'Struktur harga cenderung stabil dan terkonsolidasi tipis sepanjang hari.';
      predictionWeek = 'Ada potensi penguatan moderat jika tidak ada resistensi besar yang mengadang.';
      predictionMonth = 'Harga diharapkan tetap berada pada jalur Uptrend aman di atas rata-rata EMA.';
    }
  } else {
    if (rsi < 35) {
      predictionDay = 'Tekanan jual mereda, potensi volatilitas pantulan karena jenuh jual ekstrem.';
      predictionWeek = 'Berpeluang konsolidasi (sideways) atau reversal pendek menguji garis EMA.';
      predictionMonth = 'Jika pola akumulasi kuat terbentuk, tren berpotensi berbalik awal bulan depan.';
    } else if (rsi > 60) {
      predictionDay = 'Pullback sementara (indikasi turun) akibat tekanan jual di area Resistance.';
      predictionWeek = 'Risiko melanjutkan struktur Downtrend (penurunan lebih dalam).';
      predictionMonth = 'Pasar masih Bearish. Butuh struktur teknis jauh lebih kuat untuk mendobrak EMA ke atas.';
    } else {
      predictionDay = 'Harga tertahan lemah di rentang bawah. Hati-hati jebol support harian.';
      predictionWeek = 'Tidak ada tanda pengembalian arah (reversal) konkrit. Bias mingguan masih negatif.';
      predictionMonth = 'Tertahan di awan Bearish secara struktur makro.';
    }
  }

  return { predictionDay, predictionWeek, predictionMonth };
};

export const calculateTargets = (prices, rsi, currentPrice, ema) => {
  const valid = validatePrices(prices);
  if (valid.length === 0) return { high: 0, low: 0 };

  const onlyPrices = valid.map(p => p[1]);
  const recentHigh = Math.max(...onlyPrices);
  const recentLow = Math.min(...onlyPrices);
  const avgVolatility = (recentHigh - recentLow) || currentPrice * 0.05;

  let targetHigh = currentPrice, targetLow = currentPrice;

  if (rsi > 70) {
    targetHigh = recentHigh + (avgVolatility * 0.1);
    targetLow = ema < currentPrice ? (ema + (avgVolatility * 0.2)) : (recentLow - (avgVolatility * 0.2));
  } else if (rsi < 35) {
    targetLow = Math.max(recentLow - (avgVolatility * 0.1), recentLow * 0.95);
    targetHigh = ema > currentPrice ? (ema - (avgVolatility * 0.2)) : (recentHigh + (avgVolatility * 0.2));
  } else {
    if (currentPrice > ema) { targetHigh = currentPrice + (avgVolatility * 0.6); targetLow = currentPrice - (avgVolatility * 0.4); }
    else { targetHigh = currentPrice + (avgVolatility * 0.4); targetLow = currentPrice - (avgVolatility * 0.6); }
  }

  if (targetLow >= currentPrice) targetLow = currentPrice * 0.98;
  if (targetHigh <= currentPrice) targetHigh = currentPrice * 1.02;

  return { high: Math.round(targetHigh), low: Math.round(targetLow) };
};

// ─────────────────────────────────────────────────────────────────────────────
// Proyeksi Independen per Timeframe
// ─────────────────────────────────────────────────────────────────────────────

export const computeTimeframeProjection = (prices) => {
  const valid = validatePrices(prices);
  if (valid.length < 5) return { predictionDay: '', predictionWeek: '', predictionMonth: '' };

  const currentPrice = valid[valid.length - 1][1];
  const rsi = calculateRSI(valid, 14);
  const ema = calculateEMA(valid, 200);
  return generateTimeframePredictions(rsi, currentPrice, ema);
};

// ─────────────────────────────────────────────────────────────────────────────
// Analisis Lengkap
// ─────────────────────────────────────────────────────────────────────────────

export const analyzeMarket = (prices) => {
  const valid = validatePrices(prices);

  const empty = {
    currentPrice: 0, rsi: 0, ema: 0, status: '', signal: '',
    projectionDay: '', projectionWeek: '', projectionMonth: '',
    targetHigh: 0, targetLow: 0,
    liquidity: { top: { start: 0, end: 0 }, bottom: { start: 0, end: 0 } },
    atr: null,
    trendStrength: { score: 0, label: 'LOADING', direction: 'neutral' },
    liquidityZones: { resistance: null, support: null, resistanceCount: 0, supportCount: 0 },
    smartMoney: { signal: 'LOADING', description: '', bias: 'neutral' },
    fakeBreakout: { signal: 'LOADING', description: '', bias: 'neutral' },
  };

  if (valid.length === 0) return empty;

  const currentPrice = valid[valid.length - 1][1];
  const rsi = calculateRSI(valid, 14);
  const ema = calculateEMA(valid, 200);
  const analysis = getMarketStructureSignal(rsi, currentPrice, ema);
  const projections = generateTimeframePredictions(rsi, currentPrice, ema);
  const targets = calculateTargets(valid, rsi, currentPrice, ema);

  // Zona likuiditas chart pakai lookback 25% data terbaru
  const lookback = Math.max(Math.floor(valid.length * 0.25), Math.min(50, valid.length));
  const recSlice = valid.slice(-lookback).map(p => p[1]);
  const recHigh = Math.max(...recSlice);
  const recLow = Math.min(...recSlice);
  const avgVol = (recHigh - recLow) || currentPrice * 0.05;

  const liquidity = {
    top: { start: recHigh, end: Math.round(recHigh + avgVol * 0.15) },
    bottom: { start: Math.max(0, Math.round(recLow - avgVol * 0.15)), end: recLow },
  };

  // Indikator lanjutan
  const atr = calculateATR(valid, 14);
  const trendStrength = calculateTrendStrength(valid);
  const liquidityZones = detectRealLiquidityZones(valid);
  const smartMoney = detectSmartMoney(valid);
  const fakeBreakout = detectFakeBreakout(valid);

  return {
    currentPrice,
    rsi: rsi ?? 0,
    ema: ema ?? 0,
    status: analysis.status,
    signal: analysis.signal,
    projectionDay: projections.predictionDay,
    projectionWeek: projections.predictionWeek,
    projectionMonth: projections.predictionMonth,
    targetHigh: targets.high,
    targetLow: targets.low,
    liquidity,
    atr,
    trendStrength,
    liquidityZones,
    smartMoney,
    fakeBreakout,
  };
};