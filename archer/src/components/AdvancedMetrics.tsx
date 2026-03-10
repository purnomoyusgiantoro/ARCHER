import React from 'react';
import { MarketAnalysis } from '../utils/indicators';

interface AdvancedMetricsProps {
    metrics: MarketAnalysis;
    isLoading: boolean;
}

const SkeletonBlock: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`bg-black/10 animate-pulse ${className}`} />
);

const CardWrapper: React.FC<{ bg?: string; children: React.ReactNode }> = ({ bg = 'bg-white', children }) => (
    <div className={`${bg} border-4 border-black p-5 shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_rgba(0,0,0,1)] transition-all flex flex-col gap-3 h-full`}>
        {children}
    </div>
);

const CardTitle: React.FC<{ icon: React.ReactNode; label: React.ReactNode }> = ({ icon, label }) => (
    <div className="flex items-center justify-between border-b-4 border-black pb-3">
        <p className="text-[10px] uppercase font-black tracking-widest">{label}</p>
        {icon}
    </div>
);

const AdvancedMetrics: React.FC<AdvancedMetricsProps> = ({ metrics, isLoading }) => {
    const { rsi, ema, liquidityZones, currentPrice, volumeAnalysis, marketStructure, smartMoney, fakeBreakout } = metrics;

    // ── EMA DETAIL ───────────────────────────────────────────────────────────
    const emaCard = (
        <CardWrapper bg="bg-[#00E5FF]">
            <CardTitle
                label="Detail Analisis EMA"
                icon={<svg className="w-5 h-5 text-black shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>}
            />
            {isLoading ? (
                <SkeletonBlock className="h-20 w-full" />
            ) : (
                <div className="flex flex-col gap-3">
                    <p className="text-sm font-bold leading-tight">
                        EMA 200: <span className="font-mono">${ema.toLocaleString()}</span>
                    </p>
                    <div className="p-3 border-2 border-black bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                        <p className="text-[10px] font-black uppercase mb-1">Status Harga:</p>
                        <p className={`text-xs font-bold ${currentPrice > ema ? 'text-green-700' : 'text-red-700'}`}>
                            {currentPrice > ema 
                                ? 'Bullish - Harga bertahan kuat di atas rata-rata jangka panjang.' 
                                : 'Bearish - Harga masih tertekan di bawah rata-rata tren.'}
                        </p>
                    </div>
                </div>
            )}
        </CardWrapper>
    );

    // ── RSI MOMENTUM ────────────────────────────────────────────────────────
    const rsiCard = (
        <CardWrapper bg="bg-[#FFD700]">
            <CardTitle
                label="RSI Momentum Bar"
                icon={<svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002-2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
            />
            {isLoading ? (
                <SkeletonBlock className="h-20 w-full" />
            ) : (
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-end">
                        <p className="text-4xl font-black font-mono tracking-tighter">{rsi.toFixed(1)}</p>
                        <p className="text-[10px] font-black bg-[#0F172A] text-white px-2 py-0.5">SCORE</p>
                    </div>
                    {/* Visual Bar */}
                    <div className="relative w-full h-6 bg-white border-4 border-black box-content">
                        <div 
                            className={`h-full border-r-4 border-black ${rsi < 35 ? 'bg-red-500' : rsi > 65 ? 'bg-green-500' : 'bg-blue-400'}`}
                            style={{ width: `${rsi}%` }}
                        />
                        <div className="absolute top-0 left-[30%] h-full w-0.5 bg-black/20" />
                        <div className="absolute top-0 left-[70%] h-full w-0.5 bg-black/20" />
                    </div>
                    <div className="flex justify-between text-[8px] font-black uppercase">
                        <span>Oversold</span>
                        <span>Neutral</span>
                        <span>Overbought</span>
                    </div>
                </div>
            )}
        </CardWrapper>
    );

    // ── LIQUIDITY POOL ───────────────────────────────────────────────────────
    const liqCard = (
        <CardWrapper bg="bg-[#b4e636]">
            <CardTitle
                label="Liquidity Pool Zones"
                icon={<svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" /></svg>}
            />
            {isLoading || !liquidityZones ? (
                <SkeletonBlock className="h-20 w-full" />
            ) : (
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center bg-[#FF5722] border-2 border-black px-3 py-1.5 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                        <span className="text-[10px] font-black uppercase text-white">Resistance Zone</span>
                        <span className="font-mono text-sm font-black text-white">
                            {liquidityZones.resistance ? `$${liquidityZones.resistance.toLocaleString()}` : '—'}
                            {liquidityZones.resistanceCount > 1 && <span className="text-[10px] ml-1 text-white/70">[×{liquidityZones.resistanceCount}]</span>}
                        </span>
                    </div>
                    <div className="flex justify-between items-center bg-white border-2 border-black px-3 py-1.5 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                        <span className="text-[10px] font-black uppercase text-black">Support Zone</span>
                        <span className="font-mono text-sm font-black text-black">
                            {liquidityZones.support ? `$${liquidityZones.support.toLocaleString()}` : '—'}
                            {liquidityZones.supportCount > 1 && <span className="text-[10px] ml-1 text-gray-500">[×{liquidityZones.supportCount}]</span>}
                        </span>
                    </div>
                    <p className="text-[9px] font-bold text-black/60 text-center mt-1 uppercase italic">
                        *Area di mana likuiditas besar berkumpul
                    </p>
                </div>
            )}
        </CardWrapper>
    );

    // ── MARKET STRUCTURE ─────────────────────────────────────────────────────
    const structureCard = (
        <CardWrapper bg="bg-[#FAFAFA]">
            <CardTitle
                label="Market Structure"
                icon={<svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M4 6h16M4 12h16M4 18h16" /></svg>}
            />
            {isLoading || !marketStructure ? (
                <SkeletonBlock className="h-20 w-full" />
            ) : (
                <div className="flex flex-col gap-3">
                    <div className={`p-2 border-2 border-black text-center ${
                        marketStructure.lastStructure === 'NONE' ? 'bg-gray-200' : 'bg-[#00FF00]'
                    }`}>
                        <span className="text-xl font-black font-mono">{marketStructure.lastStructure}</span>
                    </div>
                    <p className="text-xs font-bold leading-tight text-center uppercase">
                        {marketStructure.description}
                    </p>
                    <div className="flex justify-center">
                        <span className={`text-[10px] font-black px-2 py-0.5 border-2 border-black uppercase ${
                            marketStructure.direction === 'bullish' ? 'bg-green-400' : marketStructure.direction === 'bearish' ? 'bg-red-400' : 'bg-gray-300'
                        }`}>
                            {marketStructure.direction}
                        </span>
                    </div>
                </div>
            )}
        </CardWrapper>
    );

    // ── VOLUME ANALYSIS ──────────────────────────────────────────────────────
    const volumeCard = (
        <CardWrapper bg="bg-[#FF9800]">
            <CardTitle
                label="Volume Breakdown"
                icon={<svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>}
            />
            {isLoading || !volumeAnalysis ? (
                <SkeletonBlock className="h-20 w-full" />
            ) : (
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase">Rel. Volume</span>
                        <span className="font-mono text-sm font-black">{volumeAnalysis.relativeVolume}x</span>
                    </div>
                    <div className="w-full bg-white border-2 border-black h-4 overflow-hidden">
                        <div 
                            className="h-full bg-black transition-all duration-1000" 
                            style={{ width: `${Math.min(100, volumeAnalysis.relativeVolume * 50)}%` }}
                        />
                    </div>
                    <div className="flex justify-between items-center bg-black text-white px-2 py-1">
                        <span className="text-[10px] font-black uppercase">{volumeAnalysis.trend}</span>
                        <span className="text-[10px] font-black uppercase">{volumeAnalysis.signal}</span>
                    </div>
                </div>
            )}
        </CardWrapper>
    );

    // ── TRADING BIAS ──────────────────────────────────────────────────────────
    const biasCard = (
        <CardWrapper bg="bg-[#9C27B0]">
            <CardTitle
                label="Smart Money & Bias"
                icon={<svg className="w-5 h-5 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
            />
            {isLoading || !smartMoney || !fakeBreakout ? (
                <SkeletonBlock className="h-20 w-full" />
            ) : (
                <div className="flex flex-col gap-2">
                    <div className="bg-white border-2 border-black p-2 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                        <p className="text-[9px] font-black uppercase text-gray-500 mb-0.5">Algorithm Bias:</p>
                        <p className="text-[11px] font-bold leading-tight text-black">{smartMoney.signal}</p>
                    </div>
                    <div className="bg-white border-2 border-black p-2 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                        <p className="text-[9px] font-black uppercase text-gray-500 mb-0.5">Potential Trap:</p>
                        <p className="text-[11px] font-bold leading-tight text-black">{fakeBreakout.signal}</p>
                    </div>
                    <div className={`mt-1 text-center py-1 border-2 border-black text-white text-[10px] font-black uppercase ${
                        smartMoney.bias === 'bull' ? 'bg-green-600' : smartMoney.bias === 'bear' ? 'bg-red-600' : 'bg-gray-600'
                    }`}>
                        Overall Bias: {smartMoney.bias}
                    </div>
                </div>
            )}
        </CardWrapper>
    );

    return (
        <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
                <div className="h-1 w-12 bg-black" />
                <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-black">Analisis Teknis Lanjutan</h3>
                <div className="h-1 flex-1 bg-black" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rsiCard}
                {emaCard}
                {liqCard}
                {structureCard}
                {volumeCard}
                {biasCard}
            </div>
        </div>
    );
};

export default AdvancedMetrics;
