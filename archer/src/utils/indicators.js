export const calculateSupport = (prices) => {
  const onlyPrices = prices.map(p => p[1]);
  const high = Math.max(...onlyPrices);
  const low = Math.min(...onlyPrices);
  const close = onlyPrices[onlyPrices.length - 1];
  
  const pivot = (high + low + close) / 3;
  // Rumus Support 1: (2 * Pivot) - High
  const s1 = (2 * pivot) - high;
  
  return {
    actualLow: low,
    predictedSupport: s1 > low ? low * 0.98 : s1 // Proteksi agar tidak lebih tinggi dari low asli
  };
};