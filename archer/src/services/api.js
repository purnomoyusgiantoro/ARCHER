import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
});

export const getCoinHistory = async (coinId, days) => {
  const response = await api.get(`/coins/${coinId}/market_chart`, {
    params: { vs_currency: 'usd', days: days },
  });
  return response.data.prices; // Mengembalikan array [timestamp, price]
};