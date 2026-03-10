import React, { useState, useEffect, useRef } from 'react';
import { getCoinHistory, getRealtimePrice, getCoinOHLC } from '../services/api';
import { analyzeMarket, MarketAnalysis } from '../utils/indicators';
import PriceChart from '../components/PriceChart';
import { COINS } from '../config/coins';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import TokenHeader from '../components/TokenHeader';
import MetricCards from '../components/MetricCards';
import AdvancedMetrics from '../components/AdvancedMetrics';

const DEFAULT_METRICS: MarketAnalysis = {
    currentPrice: 0,
    rsi: 0,
    ema: 0,
    status: '',
    signal: '',
    projectionDay: '',
    projectionWeek: '',
    projectionMonth: '',
    targetHigh: 0,
    targetLow: 0,
    entryRange: { min: 0, max: 0 },
    stopLoss: 0,
    confidence: 0,
    liquidity: { top: { start: 0, end: 0 }, bottom: { start: 0, end: 0 } },
    atr: null,
    trendStrength: { score: 0, label: 'LOADING', direction: 'neutral' },
    liquidityZones: { resistance: null, support: null, resistanceCount: 0, supportCount: 0 },
    smartMoney: { signal: 'LOADING', description: '', bias: 'neutral' },
    fakeBreakout: { signal: 'LOADING', description: '', bias: 'neutral' },
    volumeAnalysis: null,
    marketStructure: null,
    riskReward: null,
};

const DEFAULT_PROJECTIONS = {
    projectionDay: '',
    projectionWeek: '',
    projectionMonth: '',
};

const Dashboard: React.FC = () => {
    const [selectedCoin, setSelectedCoin] = useState('bitcoin');
    const [coinData, setCoinData] = useState<any[]>([]);
    const [metrics, setMetrics] = useState<MarketAnalysis>(DEFAULT_METRICS);
    const [days, setDays] = useState('1');
    const [realtimePrice, setRealtimePrice] = useState<number | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const currentCoinObj = COINS.find(c => c.id === selectedCoin) || COINS[0];

    // ── Realtime Price Polling ──────────────────────────────────────────────
    useEffect(() => {
        const fetchRealtime = async () => {
            try {
                const price = await getRealtimePrice(selectedCoin);
                setRealtimePrice(price);
            } catch (err) {
                console.warn('[Dashboard] Realtime fetch failed:', err);
            }
        };

        fetchRealtime();
        const interval = setInterval(fetchRealtime, 30000); // 30s
        return () => clearInterval(interval);
    }, [selectedCoin]);

    // ── Chart + Metrik ──────────────────────────────────────────────────────
    useEffect(() => {
        const loadChartData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const fetchDays = days === '4h' ? '2' : days;
                const [history, ohlc] = await Promise.all([
                    getCoinHistory(selectedCoin, fetchDays),
                    getCoinOHLC(selectedCoin, fetchDays)
                ]);
                
                const prices = history.prices;
                const volumes = history.total_volumes;

                if (prices && prices.length > 0) {
                    const formatted = prices.map((p: [number, number]) => {
                        const date = new Date(p[0]);
                        let timeLabel = '';
                        // ... existing timeLabel logic remains same ...
                        if (days === '1') {
                            timeLabel = date.toLocaleTimeString('id-ID', { 
                                timeZone: 'Asia/Jakarta', 
                                hour: '2-digit', 
                                minute: '2-digit' 
                            });
                        } else if (days === '4h') {
                            timeLabel = date.toLocaleString('id-ID', {
                                timeZone: 'Asia/Jakarta',
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                            });
                        } else {
                            timeLabel = date.toLocaleDateString('id-ID', { 
                                timeZone: 'Asia/Jakarta',
                                month: 'short', 
                                day: 'numeric' 
                            });
                        }

                        return {
                            time: timeLabel,
                            price: p[1],
                        };
                    });

                    const finalData = days === '4h' 
                        ? formatted.filter((_: any, idx: number) => idx % 4 === 0) 
                        : formatted;

                    const analysis = analyzeMarket(prices, volumes, ohlc);
                    setCoinData(finalData);
                    setMetrics(analysis);
                }
            } catch (err) {
                setError('Gagal memuat data. Periksa koneksi internet atau coba lagi.');
                console.error('[Dashboard] Chart fetch error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadChartData();
    }, [days, selectedCoin]);


    return (
        <div className="h-screen bg-[#FFF0E5] text-black antialiased font-sans flex flex-col overflow-hidden">
            <Header />

            <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                <Sidebar
                    selectedCoin={selectedCoin}
                    setSelectedCoin={setSelectedCoin}
                    days={days}
                    setDays={setDays}
                />

                <main className="flex-1 overflow-y-auto px-4 md:px-6 py-8 relative z-10 w-full no-scrollbar">
                    <div className="max-w-7xl mx-auto">
                        <TokenHeader 
                            currentCoinObj={currentCoinObj} 
                            address={currentCoinObj.address} 
                            realtimePrice={realtimePrice}
                        />

                        {error && (
                            <div className="mb-8 p-4 bg-[#FF5722] border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] flex items-center gap-3">
                                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                </svg>
                                <p className="font-black uppercase text-sm tracking-wide">{error}</p>
                            </div>
                        )}

                        <MetricCards metrics={metrics} isLoading={isLoading} />

                        <AdvancedMetrics metrics={metrics} isLoading={isLoading} />

                        {/* Chart Section */}
                        <div className="bg-white border-4 border-black p-4 md:p-8 shadow-[12px_12px_0px_rgba(0,0,0,1)] mb-8 overflow-hidden">
                            <div className="flex justify-between items-center mb-6 border-b-4 border-black pb-4">
                                <h3 className="text-lg md:text-xl font-black uppercase tracking-tighter flex items-center gap-3">
                                    <div className="w-3 h-3 bg-[#00E5FF] border-2 border-black animate-bounce shadow-[2px_2px_0px_rgba(0,0,0,1)]"></div>
                                    Historical Analysis
                                </h3>
                                <div className="text-[10px] font-black uppercase bg-[#0F172A] text-white px-3 py-1 hidden sm:block">
                                    Waktu: Jakarta (WIB)
                                </div>
                            </div>

                            <PriceChart 
                                data={coinData} 
                                liquidity={metrics.liquidity} 
                                targets={{ 
                                    high: metrics.targetHigh, 
                                    low: metrics.targetLow,
                                    entryRange: metrics.entryRange,
                                    stopLoss: metrics.stopLoss
                                }}
                                isLoading={isLoading} 
                            />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
