export const calculateRSI = (prices, period = 14) => {
  if (!prices || prices.length <= period) {
    return null;
  }

  const closePrices = prices.map(p => p[1]);
  let gains = 0;
  let losses = 0;

  // Calculate initial Average Gain/Loss for the first 'period'
  for (let i = 1; i <= period; i++) {
    const difference = closePrices[i] - closePrices[i - 1];
    if (difference >= 0) {
      gains += difference;
    } else {
      losses -= difference;
    }
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  // Calculate Smoothed Moving Average for subsequent periods
  for (let i = period + 1; i < closePrices.length; i++) {
    const difference = closePrices[i] - closePrices[i - 1];
    if (difference >= 0) {
      avgGain = ((avgGain * (period - 1)) + difference) / period;
      avgLoss = (avgLoss * (period - 1)) / period;
    } else {
      avgGain = (avgGain * (period - 1)) / period;
      avgLoss = ((avgLoss * (period - 1)) - difference) / period;
    }
  }

  if (avgLoss === 0) return 100;

  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));

  return Math.round(rsi * 100) / 100; // Round to 2 decimals
};

export const calculateEMA = (prices, period = 200) => {
  if (!prices || prices.length === 0) return null;

  // Depending on the timeframe selected, the data lengths might be less than 200.
  // In that case, we fall back to a smaller representative period, like length/2 or SMA.
  const effectivePeriod = prices.length >= period ? period : Math.max(Math.floor(prices.length * 0.75), 2);
  const closePrices = prices.map(p => p[1]);

  // Calculate initial SMA
  let sum = 0;
  for (let i = 0; i < effectivePeriod; i++) {
    sum += closePrices[i];
  }
  let ema = sum / effectivePeriod;

  const multiplier = 2 / (effectivePeriod + 1);

  // Calculate subsequent EMAs
  for (let i = effectivePeriod; i < closePrices.length; i++) {
    ema = (closePrices[i] - ema) * multiplier + ema;
  }

  return ema;
};

export const getMarketStructureSignal = (rsi, currentPrice, ema) => {
  // Analisa berdasarkan parameter dari panduan Profesional
  let status = "NETRAL";
  let signal = "Tunggu Konfirmasi Pola/BOS";

  if (!rsi || !ema) return { status: "LOADING", signal: "Memindai Data..." };

  // Analisa Oversold (Peluang Reversal Naik/Akumulasi)
  if (rsi < 35 && currentPrice < ema) {
    status = "OVERSOLD EXTREME";
    signal = "Waspada Area Pembalikan Uptrend (Reversal)";
  }
  else if (rsi < 40 && currentPrice >= ema) {
    status = "KOREKSI WAJAR";
    signal = "Peluang Entry Pantulan EMA";
  }
  // Analisa Overbought (Risiko Penurunan/Distribusi)
  else if (rsi > 70 && currentPrice > ema) {
    status = "OVERBOUGHT EXTREME";
    signal = "Risiko Koreksi Tinggi (Distribusi)";
  }
  else if (rsi > 60 && currentPrice < ema) {
    status = "BEARISH BOUNCE";
    signal = "Pullback sementara di bawah EMA";
  }
  else if (currentPrice > ema) {
    status = "BULLISH (UPTREND)";
    signal = "Harga stabil di atas Rata-rata";
  }
  else if (currentPrice < ema) {
    status = "BEARISH (DOWNTREND)";
    signal = "Harga tertahan di bawah Rata-rata";
  }

  return { status, signal };
};

export const generateTimeframePredictions = (rsi, currentPrice, ema) => {
  // Proyeksi Berbasis Probabilitas
  let predictionDay = "Sinyal belum cukup jelas untuk hari ini.";
  let predictionWeek = "Sinyal belum cukup jelas untuk struktur mingguan.";
  let predictionMonth = "Sinyal belum cukup jelas untuk tren makro bulanan.";

  if (currentPrice > ema) {
    if (rsi > 70) {
      predictionDay = "Risiko aksi ambil untung (Take Profit). Bisa turun menguji support terdekat.";
      predictionWeek = "Kecenderungan koreksi sehat sebelum mencoba menembus level Resistance baru.";
      predictionMonth = "Tren Bullish kuat. Distribusi bisa membuat pasar konsolidasi di rentang tinggi bulan ini.";
    } else if (rsi < 40) {
      predictionDay = "Pantulan harga (Bounce) berpeluang terjadi dalam 24 jam ke depan di area rata-rata tren.";
      predictionWeek = "Berpeluang kembali melanjutkan Uptrend setelah koreksi mereda.";
      predictionMonth = "Peluang akumulasi terbaik bulan ini sebelum tren harga naik lebih lanjut.";
    } else {
      predictionDay = "Struktur harga cenderung stabil dan terkonsolidasi tipis sepanjang hari.";
      predictionWeek = "Ada potensi penguatan moderat jika tidak ada resistensi besar yang mengadang.";
      predictionMonth = "Harga diharapkan tetap berada pada jalur Uptrend aman di atas rata-rata EMA.";
    }
  } else {
    if (rsi < 35) {
      predictionDay = "Tekanan jual mereda, potensi volatilitas pantulan karena jenuh jual ekstrem.";
      predictionWeek = "Berpeluang konsolidasi (sideways) atau reversal pendek menguji garis EMA.";
      predictionMonth = "Jika pola akumulasi kuat terbentuk, tren berpotensi berbalik awal bulan depan.";
    } else if (rsi > 60) {
      predictionDay = "Pullback sementara (indikasi turun) akibat tekanan jual di area Resistance.";
      predictionWeek = "Risiko melanjutkan struktur Downtrend (penurunan lebih dalam).";
      predictionMonth = "Pasar masih Bearish. Butuh struktur teknis jauh lebih kuat untuk mendobrak EMA ke atas.";
    } else {
      predictionDay = "Harga tertahan lemah di rentang bawah. Hati-hati jebol support harian.";
      predictionWeek = "Tidak ada tanda pengembalian arah (reversal) konkrit. Bias mingguan masih negatif.";
      predictionMonth = "Tertahan di awan Bearish secara struktur makro.";
    }
  }

  return { predictionDay, predictionWeek, predictionMonth };
};

export const calculateTargets = (prices, rsi, currentPrice, ema) => {
  if (!prices || prices.length === 0) return { high: 0, low: 0 };

  const onlyPrices = prices.map(p => p[1]);
  const recentHigh = Math.max(...onlyPrices);
  const recentLow = Math.min(...onlyPrices);

  // Hitung Volatilitas Aktual dalam periode ini
  const volatilityVol = recentHigh - recentLow;
  const avgVolatility = volatilityVol > 0 ? volatilityVol : (currentPrice * 0.05); // Backup 5% default

  let targetHigh = currentPrice;
  let targetLow = currentPrice;

  // Logika Probabilitas Berbasis RSI & Trend
  if (rsi > 70) {
    // OVERBOUGHT: Risiko turun. High ditargetkan di pucuk saat ini (sedikit optimism), Low ditarik kuat ke EMA
    targetHigh = recentHigh + (avgVolatility * 0.1);
    targetLow = ema < currentPrice ? (ema + (avgVolatility * 0.2)) : (recentLow - (avgVolatility * 0.2));
  } else if (rsi < 35) {
    // OVERSOLD: Risiko pantulan. Low ditahan dekat support historis, High ditarget ke arah balik rata-rata (EMA)
    targetLow = Math.max(recentLow - (avgVolatility * 0.1), recentLow * 0.95);
    targetHigh = ema > currentPrice ? (ema - (avgVolatility * 0.2)) : (recentHigh + (avgVolatility * 0.2));
  } else {
    // NEUTRAL: Ekstrapolasi standard penyimpangan (sideways)
    if (currentPrice > ema) {
      targetHigh = currentPrice + (avgVolatility * 0.6);
      targetLow = currentPrice - (avgVolatility * 0.4);
    } else {
      targetHigh = currentPrice + (avgVolatility * 0.4);
      targetLow = currentPrice - (avgVolatility * 0.6);
    }
  }

  // Safety checks untuk menjaga range logika jika ada sumbu harga ekstrem
  if (targetLow >= currentPrice) targetLow = currentPrice * 0.98;
  if (targetHigh <= currentPrice) targetHigh = currentPrice * 1.02;

  return {
    high: targetHigh,
    low: targetLow
  };
};

export const analyzeMarket = (prices) => {
  if (!prices || prices.length === 0) {
    return { actualLow: 0, rsi: 0, ema: 0, currentPrice: 0, status: "", signal: "" };
  }

  const onlyPrices = prices.map(p => p[1]);
  const low = Math.min(...onlyPrices);
  const currentPrice = onlyPrices[onlyPrices.length - 1];

  const rsi = calculateRSI(prices, 14);
  const ema = calculateEMA(prices, 200);
  const analysis = getMarketStructureSignal(rsi, currentPrice, ema);
  const projections = generateTimeframePredictions(rsi, currentPrice, ema);
  const targets = calculateTargets(prices, rsi, currentPrice, ema);

  return {
    actualLow: low,
    currentPrice: currentPrice,
    rsi: rsi || 0,
    ema: ema || 0,
    status: analysis.status,
    signal: analysis.signal,
    projectionDay: projections.predictionDay,
    projectionWeek: projections.predictionWeek,
    projectionMonth: projections.predictionMonth,
    targetHigh: targets.high,
    targetLow: targets.low
  };
};