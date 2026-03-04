import React, { useState, useEffect } from 'react';
import { getCoinHistory } from './services/api';
import { calculateSupport } from './utils/indicators';
import PriceChart from './components/PriceChart';

function App() {
  const [coinData, setCoinData] = useState([]);
  const [metrics, setMetrics] = useState({ low: 0, support: 0 });
  const [days, setDays] = useState('7');

  useEffect(() => {
    const loadData = async () => {
      const prices = await getCoinHistory('bitcoin', days);
      const formatted = prices.map(p => ({ time: p[0], price: p[1] }));
      const { actualLow, predictedSupport } = calculateSupport(prices);
      
      setCoinData(formatted);
      setMetrics({ low: actualLow, support: predictedSupport });
    };
    loadData();
  }, [days]);

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-200 antialiased pb-10">
      {/* Header Mobile Friendly */}
      <nav className="p-6 flex justify-between items-center border-b border-slate-800 mb-8">
        <h1 className="text-xl font-black tracking-tighter text-white">CRYPTO<span className="text-yellow-500">LAB</span></h1>
        <div className="bg-slate-800 p-1 rounded-xl flex gap-1">
          {['1', '7', '30'].map(d => (
            <button key={d} onClick={() => setDays(d)} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${days === d ? 'bg-yellow-500 text-black' : 'text-slate-400'}`}>
              {d === '1' ? '1D' : d === '7' ? '1W' : '1M'}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-md mx-auto px-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Lowest (Hist)</p>
            <p className="text-lg font-mono text-white">${metrics.low.toLocaleString()}</p>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-2xl">
            <p className="text-[10px] uppercase text-yellow-600 font-bold mb-1">Predicted Low</p>
            <p className="text-lg font-mono text-yellow-500">${metrics.support.toLocaleString()}</p>
          </div>
        </div>

        {/* Chart Section */}
        <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Live Market Analysis
        </h3>
        <PriceChart data={coinData} />
      </main>
    </div>
  );
}

export default App;

const loadData = async () => {
  const prices = await getCoinHistory(coinId, days);
  
  if (prices && prices.length > 0) {
    const formatted = prices.map(p => ({
      // Ubah timestamp milidetik ke jam atau tanggal agar terbaca
      time: new Date(p[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      price: p[1]
    }));
    setCoinData(formatted);
    
    const { actualLow, predictedSupport } = calculateSupport(prices);
    setMetrics({ low: actualLow, support: predictedSupport });
  }
};