import React, { useState, useEffect } from 'react';
import { getCoinHistory } from '../services/api';
import { analyzeMarket } from '../utils/indicators';
import PriceChart from '../components/PriceChart';

const Dashboard = () => {
    const [coinData, setCoinData] = useState([]);
    const [metrics, setMetrics] = useState({
        actualLow: 0, currentPrice: 0, rsi: 0, ema: 0, status: "", signal: "",
        projectionDay: "", projectionWeek: "", projectionMonth: "",
        targetHigh: 0, targetLow: 0
    });
    const [days, setDays] = useState('1');
    const [copied, setCopied] = useState(false);

    const mockAddress = "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh";

    useEffect(() => {
        const loadData = async () => {
            try {
                const prices = await getCoinHistory('bitcoin', days);
                if (prices && prices.length > 0) {
                    const formatted = prices.map(p => {
                        const date = new Date(p[0]);
                        return {
                            time: days === '1'
                                ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                : date.toLocaleDateString([], { month: 'short', day: 'numeric' }),
                            price: p[1]
                        };
                    });

                    setCoinData(formatted);
                    const analysisData = analyzeMarket(prices);
                    setMetrics(analysisData);
                }
            } catch (error) {
                console.error("Failed to fetch data", error);
            }
        };
        loadData();
    }, [days]);

    const copyAddress = () => {
        navigator.clipboard.writeText(mockAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-[#FFF0E5] text-black antialiased pb-10 font-sans selection:bg-black selection:text-[#FFF0E5]">

            {/* Header */}
            <nav className="p-6 relative z-10 flex flex-col md:flex-row justify-between items-center border-b-4 border-black mb-8 bg-white">
                <div className="flex items-center gap-3 mb-4 md:mb-0">
                    <div className="w-10 h-10 bg-[#FFD700] border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                    </div>
                    <h1 className="text-2xl font-black uppercase tracking-tighter text-black">
                        CRYPTO<span className="text-[#FF5722]">ARCHER</span>
                    </h1>
                </div>

                {/* Timeframe Selector */}
                <div className="flex gap-2">
                    {[
                        { id: '1', label: '1 Hari', color: 'bg-[#FFD700]' },
                        { id: '7', label: '1 Minggu', color: 'bg-[#00E5FF]' },
                        { id: '30', label: '1 Bulan', color: 'bg-[#FF5722]' }
                    ].map(d => (
                        <button
                            key={d.id}
                            onClick={() => setDays(d.id)}
                            className={`px-5 py-2 text-sm font-black border-4 border-black uppercase transition-all duration-75 ${days === d.id
                                ? `${d.color} translate-y-1 translate-x-1 shadow-none`
                                : 'bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:bg-gray-100 active:translate-y-1 active:translate-x-1 active:shadow-none'
                                }`}
                        >
                            {d.label}
                        </button>
                    ))}
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-6 relative z-10">
                {/* Token Info & Address */}
                <div className="mb-10 p-6 bg-white border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#FF5722] border-4 border-black flex items-center justify-center p-1.5 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                            <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.svg" alt="BTC" className="w-full h-full filter invert" style={{ mixBlendMode: 'multiply' }} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-black uppercase tracking-tight">Bitcoin <span className="text-gray-500 text-sm font-bold">BTC</span></h2>
                            <div className="flex items-center gap-3 mt-2">
                                <span className="text-xs font-black text-black uppercase bg-[#00E5FF] px-3 py-1 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">Active</span>
                                <span className="text-xs font-bold text-gray-600 uppercase border-b-2 border-black">Proof of Work</span>
                            </div>
                        </div>
                    </div>

                    {/* Address Section */}
                    <div className="flex flex-col items-start md:items-end">
                        <span className="text-sm text-black font-black mb-2 uppercase tracking-widest bg-[#FFD700] px-2 py-1 border-2 border-black">Network Address</span>
                        <button
                            onClick={copyAddress}
                            className="group flex items-center gap-3 bg-white border-4 border-black px-4 py-2 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform active:translate-y-1 active:translate-x-1 active:shadow-none"
                        >
                            <span className="font-mono text-sm font-bold text-black group-hover:text-[#FF5722] transition-colors">
                                {mockAddress.slice(0, 8)}...{mockAddress.slice(-6)}
                            </span>
                            {copied ? (
                                <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                            ) : (
                                <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Metric Cards - Neo-Brutalism Style */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {/* EMA TREND CARD */}
                    <div className="bg-[#00E5FF] border-4 border-black p-6 shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_rgba(0,0,0,1)] transition-all">
                        <div className="flex items-center justify-between mb-3 border-b-4 border-black pb-3">
                            <p className="text-xs uppercase text-black font-black tracking-widest">Arah Tren (EMA)</p>
                            <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>
                        </div>
                        <p className="text-3xl font-black font-mono text-black tracking-tighter">
                            <span className="text-black/50 mr-1">$</span>
                            {metrics.ema.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </p>
                        <div className="mt-4 text-xs font-bold text-black bg-white border-2 border-black inline-block px-2 py-1 uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)] line-clamp-1 truncate">
                            {metrics.currentPrice > metrics.ema ? 'HARGA > EMA (UPTREND)' : 'HARGA < EMA (DOWNTREND)'}
                        </div>
                    </div>

                    {/* RSI CARD (Dynamic Condition) */}
                    <div className="bg-[#FFD700] border-4 border-black p-6 shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_rgba(0,0,0,1)] transition-all">
                        <div className="flex items-center justify-between mb-3 border-b-4 border-black pb-3">
                            <p className="text-xs uppercase text-black font-black tracking-widest">Momentum (RSI)</p>
                            <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002-2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                        </div>
                        <p className="text-3xl font-black font-mono text-black tracking-tighter">
                            {metrics.rsi.toFixed(1)} <span className="text-black/50 text-xl font-sans font-bold">/100</span>
                        </p>
                        <div className={`mt-4 text-[10px] font-bold text-black bg-white border-2 border-black inline-block px-2 py-1 uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)] ${metrics.rsi < 35 ? 'text-green-600' : metrics.rsi > 70 ? 'text-red-600' : ''}`}>
                            {metrics.rsi < 35 ? 'Extremely Oversold (Jenuh Jual)' : metrics.rsi > 70 ? 'Extremely Overbought (Titik Puncak)' : 'Fase Netral'}
                        </div>
                    </div>

                    {/* MARKET SIGNAL CARD */}
                    <div className="bg-[#FF5722] border-4 border-black p-6 shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_rgba(0,0,0,1)] transition-all">
                        <div className="flex items-center justify-between mb-3 border-b-4 border-black pb-3">
                            <p className="text-xs uppercase text-black font-black tracking-widest">Sinyal Teknis</p>
                            <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                        </div>
                        <p className="text-xl leading-tight font-black uppercase text-black tracking-tighter line-clamp-2">
                            {metrics.status}
                        </p>
                        <div className="mt-2 text-[10px] font-black tracking-widest text-[#FFF0E5]">
                            {metrics.signal}
                        </div>
                    </div>
                </div>

                {/* FUTURE PROJECTION SECTION */}
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-1 w-12 bg-black"></div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter text-black">Proyeksi Masa Depan</h3>
                        <div className="h-1 flex-1 bg-black"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* 1 DAY PROJECTION */}
                        <div className="bg-white border-4 border-black p-5 shadow-[6px_6px_0px_rgba(0,0,0,1)] flex flex-col justify-between hover:-translate-y-1 hover:shadow-[10px_10px_0px_rgba(0,0,0,1)] transition-all">
                            <div>
                                <div className="inline-block bg-[#FFD700] border-2 border-black px-3 py-1 mb-3">
                                    <p className="text-xs font-black uppercase tracking-widest text-black">Hari Ini (1D)</p>
                                </div>
                                <p className="text-sm font-bold leading-relaxed text-black mb-4">
                                    {metrics.projectionDay || "Memuat prediksi harian..."}
                                </p>
                            </div>
                            {days === '1' && (
                                <div className="mt-4 pt-4 border-t-4 border-black border-dashed flex justify-between items-center gap-2">
                                    <div className="bg-[#00E5FF] px-2 py-1 border-2 border-black text-xs font-black text-black">
                                        TARGET NAIK: <span className="font-mono">${metrics.targetHigh.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                    </div>
                                    <div className="bg-[#FF5722] px-2 py-1 border-2 border-black text-xs font-black text-[#FFF0E5]">
                                        SUPPORT: <span className="font-mono">${metrics.targetLow.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 1 WEEK PROJECTION */}
                        <div className="bg-white border-4 border-black p-5 shadow-[6px_6px_0px_rgba(0,0,0,1)] flex flex-col justify-between hover:-translate-y-1 hover:shadow-[10px_10px_0px_rgba(0,0,0,1)] transition-all">
                            <div>
                                <div className="inline-block bg-[#00E5FF] border-2 border-black px-3 py-1 mb-3">
                                    <p className="text-xs font-black uppercase tracking-widest text-black">Minggu Ini (1W)</p>
                                </div>
                                <p className="text-sm font-bold leading-relaxed text-black mb-4">
                                    {metrics.projectionWeek || "Memuat prediksi mingguan..."}
                                </p>
                            </div>
                            {days === '7' && (
                                <div className="mt-4 pt-4 border-t-4 border-black border-dashed flex justify-between items-center gap-2">
                                    <div className="bg-[#FFD700] px-2 py-1 border-2 border-black text-xs font-black text-black">
                                        TARGET NAIK: <span className="font-mono">${metrics.targetHigh.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                    </div>
                                    <div className="bg-[#FF5722] px-2 py-1 border-2 border-black text-xs font-black text-[#FFF0E5]">
                                        SUPPORT: <span className="font-mono">${metrics.targetLow.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 1 MONTH PROJECTION */}
                        <div className="bg-white border-4 border-black p-5 shadow-[6px_6px_0px_rgba(0,0,0,1)] flex flex-col justify-between hover:-translate-y-1 hover:shadow-[10px_10px_0px_rgba(0,0,0,1)] transition-all">
                            <div>
                                <div className="inline-block bg-[#FF5722] border-2 border-black px-3 py-1 mb-3">
                                    <p className="text-xs font-black uppercase tracking-widest text-[#FFF0E5]">Bulan Ini (1M)</p>
                                </div>
                                <p className="text-sm font-bold leading-relaxed text-black mb-4">
                                    {metrics.projectionMonth || "Memuat prediksi bulanan..."}
                                </p>
                            </div>
                            {days === '30' && (
                                <div className="mt-4 pt-4 border-t-4 border-black border-dashed flex justify-between items-center gap-2">
                                    <div className="bg-[#00E5FF] px-2 py-1 border-2 border-black text-xs font-black text-black">
                                        TARGET NAIK: <span className="font-mono">${metrics.targetHigh.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                    </div>
                                    <div className="bg-[#FFD700] px-2 py-1 border-2 border-black text-xs font-black text-black">
                                        SUPPORT: <span className="font-mono">${metrics.targetLow.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Chart Section */}
                <div className="bg-white border-4 border-black p-6 md:p-8 shadow-[12px_12px_0px_rgba(0,0,0,1)]">
                    <div className="flex justify-between items-center mb-6 border-b-4 border-black pb-4">
                        <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
                            <div className="w-3 h-3 bg-[#00E5FF] border-2 border-black animate-bounce shadow-[2px_2px_0px_rgba(0,0,0,1)]"></div>
                            Analysis Data
                        </h3>
                    </div>

                    <PriceChart data={coinData} />
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
