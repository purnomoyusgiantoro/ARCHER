import React, { useState, useEffect } from 'react';
import { getCoinHistory } from '../services/api';
import { analyzeMarket, computeTimeframeProjection } from '../utils/indicators';
import PriceChart from '../components/PriceChart';
import { COINS } from '../config/coins';
import Header from '../components/Header';
import TokenHeader from '../components/TokenHeader';
import MetricCards from '../components/MetricCards';
import ProjectionCards from '../components/ProjectionCards';
import AdvancedMetrics from '../components/AdvancedMetrics';

const DEFAULT_METRICS = {
    currentPrice: 0,
    rsi: 0,
    ema: 0,
    status: '',
    signal: '',
    targetHigh: 0,
    targetLow: 0,
    liquidity: { top: { start: 0, end: 0 }, bottom: { start: 0, end: 0 } },
    // Indikator lanjutan
    atr: null,
    trendStrength: { score: 0, label: 'LOADING', direction: 'neutral' },
    liquidityZones: { resistance: null, support: null, resistanceCount: 0, supportCount: 0 },
    smartMoney: { signal: 'LOADING', description: '', bias: 'neutral' },
    fakeBreakout: { signal: 'LOADING', description: '', bias: 'neutral' },
};

const DEFAULT_PROJECTIONS = {
    projectionDay: '',
    projectionWeek: '',
    projectionMonth: '',
};

const Dashboard = () => {
    const [selectedCoin, setSelectedCoin] = useState('bitcoin');
    const [coinData, setCoinData] = useState([]);
    const [metrics, setMetrics] = useState(DEFAULT_METRICS);
    const [projections, setProjections] = useState(DEFAULT_PROJECTIONS);
    const [days, setDays] = useState('1');
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingProjections, setIsLoadingProjections] = useState(true);
    const [error, setError] = useState(null);

    const currentCoinObj = COINS.find(c => c.id === selectedCoin) || COINS[0];

    // ── Chart + Metrik (berubah saat koin atau timeframe berganti) ─────────────
    useEffect(() => {
        const loadChartData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const prices = await getCoinHistory(selectedCoin, days);
                if (prices && prices.length > 0) {
                    const formatted = prices.map(p => {
                        const date = new Date(p[0]);
                        return {
                            time: days === '1'
                                ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                : date.toLocaleDateString([], { month: 'short', day: 'numeric' }),
                            price: p[1],
                        };
                    });

                    const analysis = analyzeMarket(prices);
                    setCoinData(formatted);
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

    // ── Proyeksi independen (hanya berubah saat koin berganti) ────────────────
    useEffect(() => {
        const loadProjections = async () => {
            setIsLoadingProjections(true);

            try {
                const [data1d, data7d, data30d] = await Promise.all([
                    getCoinHistory(selectedCoin, '1'),
                    getCoinHistory(selectedCoin, '7'),
                    getCoinHistory(selectedCoin, '30'),
                ]);

                const proj1d = computeTimeframeProjection(data1d);
                const proj7d = computeTimeframeProjection(data7d);
                const proj30d = computeTimeframeProjection(data30d);

                setProjections({
                    projectionDay: proj1d.predictionDay,
                    projectionWeek: proj7d.predictionWeek,
                    projectionMonth: proj30d.predictionMonth,
                });
            } catch (err) {
                console.error('[Dashboard] Projection fetch error:', err);
            } finally {
                setIsLoadingProjections(false);
            }
        };

        loadProjections();
    }, [selectedCoin]);

    return (
        <div className="min-h-screen bg-[#FFF0E5] text-black antialiased pb-10 font-sans selection:bg-black selection:text-[#FFF0E5]">
            <Header
                selectedCoin={selectedCoin}
                setSelectedCoin={setSelectedCoin}
                days={days}
                setDays={setDays}
            />

            <main className="max-w-5xl mx-auto px-6 relative z-10">
                <TokenHeader currentCoinObj={currentCoinObj} address={currentCoinObj.address} />

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

                <ProjectionCards
                    projections={projections}
                    metrics={metrics}
                    isLoading={isLoadingProjections}
                />

                {/* Chart Section */}
                <div className="bg-white border-4 border-black p-6 md:p-8 shadow-[12px_12px_0px_rgba(0,0,0,1)]">
                    <div className="flex justify-between items-center mb-6 border-b-4 border-black pb-4">
                        <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
                            <div className="w-3 h-3 bg-[#00E5FF] border-2 border-black animate-bounce shadow-[2px_2px_0px_rgba(0,0,0,1)]"></div>
                            Analysis Data
                        </h3>
                    </div>

                    <PriceChart data={coinData} liquidity={metrics.liquidity} isLoading={isLoading} />
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
