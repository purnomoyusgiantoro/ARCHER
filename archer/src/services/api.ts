import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
  timeout: 10000,
});

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface MarketChartData {
    prices: [number, number][];
    total_volumes: [number, number][];
}

export const getCoinHistory = async (coinId: string, days: string, retries = 3): Promise<MarketChartData> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await api.get(`/coins/${coinId}/market_chart`, {
        params: { vs_currency: 'usd', days },
      });
      return {
          prices: response.data.prices,
          total_volumes: response.data.total_volumes
      };
    } catch (error: any) {
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
  return { prices: [], total_volumes: [] };
};

export const getCoinOHLC = async (coinId: string, days: string, retries = 3): Promise<[number, number, number, number, number][]> => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await api.get(`/coins/${coinId}/ohlc`, {
                params: { vs_currency: 'usd', days },
            });
            return response.data; // [time, open, high, low, close]
        } catch (error: any) {
            const isLastAttempt = attempt === retries;
            const status = error.response?.status;

            if (status === 429 && !isLastAttempt) {
                await sleep(attempt * 2000);
                continue;
            }

            if (isLastAttempt) {
                console.error(`[API] Gagal fetch OHLC ${coinId} setelah ${retries} percobaan:`, error.message);
                throw error;
            }

            await sleep(attempt * 1000);
        }
    }
    return [];
};

export const getRealtimePrice = async (coinId: string): Promise<number> => {
    try {
        const response = await api.get('/simple/price', {
            params: {
                ids: coinId,
                vs_currencies: 'usd'
            }
        });
        return response.data[coinId].usd;
    } catch (error) {
        console.error('[API] Realtime price error:', error);
        throw error;
    }
};
