import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
  timeout: 10000,
});

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getCoinHistory = async (coinId, days, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await api.get(`/coins/${coinId}/market_chart`, {
        params: { vs_currency: 'usd', days },
      });
      return response.data.prices;
    } catch (error) {
      const isLastAttempt = attempt === retries;
      const status = error.response?.status;

      if (status === 429 && !isLastAttempt) {
        // Rate limited — tunggu sebelum retry
        await sleep(attempt * 2000);
        continue;
      }

      if (isLastAttempt) {
        console.error(`[API] Gagal fetch ${coinId} setelah ${retries} percobaan:`, error.message);
        throw error;
      }

      await sleep(attempt * 1000);
    }
  }
};