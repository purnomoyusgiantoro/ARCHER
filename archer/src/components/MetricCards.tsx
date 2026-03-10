import React from 'react';
import { MarketAnalysis } from '../utils/indicators';

interface MetricCardsProps {
    metrics: MarketAnalysis;
    isLoading: boolean;
}

const SkeletonBlock: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`bg-black/10 animate-pulse ${className}`} />
);

const MetricCards: React.FC<MetricCardsProps> = ({ metrics, isLoading }) => {
    return (
        <div className="flex flex-col gap-6 md:gap-8 mb-12">
            
            {/* SPOT ACCUMULATION ANALYSIS (Hero Replacement) */}
            <div className={`border-4 border-black p-6 md:p-8 shadow-[12px_12px_0px_rgba(0,0,0,1)] flex flex-col lg:flex-row items-center justify-between gap-8 transition-colors duration-500 ${
                isLoading ? 'bg-gray-200' : 'bg-white'
            }`}>
                <div className="flex items-center gap-6 w-full lg:w-auto">
                    <div className="bg-[#0F172A] text-white p-5 border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,0.3)] min-w-[200px]">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-1 text-[#00FF00]">Spot Analysis</p>
                        <h2 className="text-4xl font-black italic tracking-tighter text-[#00E5FF]">
                            {isLoading ? 'ANALYZING' : 'STRATEGY'}
                        </h2>
                    </div>
                    <div className="flex-1">
                        <p className="text-lg md:text-xl font-black uppercase text-black leading-tight tracking-tighter">
                            {isLoading ? 'Calculating market liquidity...' : 'Fokus Akumulasi Spot & Exit Strategy'}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="w-2 h-2 rounded-full bg-[#00FF00] animate-pulse"></span>
                            <p className="text-[10px] font-black text-black/60 uppercase tracking-widest">
                                Proyeksi Harga Tunggal Berdasarkan Timeframe (WIB)
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {/* CONFIDENCE & SIGNAL CARD */}
                <div className="bg-[#FFD700] border-4 border-black p-6 shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_rgba(0,0,0,1)] transition-all flex flex-col justify-between overflow-hidden">
                    <div>
                        <div className="flex items-center justify-between mb-3 border-b-4 border-black pb-3">
                            <p className="text-[10px] uppercase text-black font-black tracking-widest">Confidence Level</p>
                            <div className="bg-[#0F172A] text-[#FFD700] px-2 py-0.5 text-[10px] font-black">
                                {isLoading ? '...' : `${metrics.confidence}%`}
                            </div>
                        </div>
                        {isLoading ? (
                            <SkeletonBlock className="h-8 w-full mb-1" />
                        ) : (
                            <p className="text-lg md:text-xl leading-tight font-black uppercase text-black tracking-tighter break-words">
                                {metrics.status}
                            </p>
                        )}
                    </div>
                    <div className="mt-4 bg-[#0F172A] p-2 border-2 border-dashed border-white flex-1 flex items-center justify-center">
                        {isLoading ? (
                            <SkeletonBlock className="h-3 w-full bg-white/20" />
                        ) : (
                            <p className="text-[10px] font-black tracking-widest text-[#FFF0E5] text-center">
                                {metrics.signal}
                            </p>
                        )}
                    </div>
                </div>

                {/* ENTRY RANGE CARD */}
                <div className="bg-[#00FF00] border-4 border-black p-6 shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_rgba(0,0,0,1)] transition-all flex flex-col justify-between overflow-hidden">
                    <div>
                        <div className="flex items-center justify-between mb-3 border-b-4 border-black pb-3">
                            <p className="text-[10px] uppercase text-black font-black tracking-widest">Optimal Entry Range</p>
                            <svg className="w-5 h-5 text-black shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                        </div>
                        {isLoading ? (
                            <SkeletonBlock className="h-9 w-full mb-1" />
                        ) : (
                            <p className="text-xl md:text-2xl font-black font-mono text-black tracking-tighter">
                                ${metrics.entryRange.min.toLocaleString()} - ${metrics.entryRange.max.toLocaleString()}
                            </p>
                        )}
                    </div>
                    <div className="mt-4 text-[10px] font-bold text-black bg-white border-2 border-black px-2 py-1 shadow-[2px_2px_0px_rgba(0,0,0,1)] text-center break-words">
                        AREA BELI TERBAIK (SPOT ONLY)
                    </div>
                </div>

                {/* TARGET HIGH CARD */}
                <div className="bg-[#00E5FF] border-4 border-black p-6 shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_rgba(0,0,0,1)] transition-all flex flex-col justify-between overflow-hidden">
                    <div>
                        <div className="flex items-center justify-between mb-3 border-b-4 border-black pb-3">
                            <p className="text-[10px] uppercase text-black font-black tracking-widest">Take Profit (Target)</p>
                            <svg className="w-5 h-5 text-black shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        {isLoading ? (
                            <SkeletonBlock className="h-9 w-3/4 mb-1" />
                        ) : (
                            <p className="text-2xl md:text-3xl font-black font-mono text-black tracking-tighter">
                                <span className="text-black/50 mr-1">$</span>
                                {metrics.targetHigh.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </p>
                        )}
                    </div>
                    <div className="mt-4 text-[10px] font-bold text-black bg-white border-2 border-black px-2 py-1 uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)] text-center break-words">
                        POTENSI KENAIKAN HARGA
                    </div>
                </div>

                {/* STOP LOSS CARD */}
                <div className="bg-[#FF00FF] border-4 border-black p-6 shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_rgba(0,0,0,1)] transition-all flex flex-col justify-between overflow-hidden">
                    <div>
                        <div className="flex items-center justify-between mb-3 border-b-4 border-black pb-3">
                            <p className="text-[10px] uppercase text-white font-black tracking-widest">Stop Loss (Risk)</p>
                            <svg className="w-5 h-5 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        {isLoading ? (
                            <SkeletonBlock className="h-9 w-3/4 mb-1" />
                        ) : (
                            <p className="text-2xl md:text-3xl font-black font-mono text-white tracking-tighter">
                                <span className="text-white/50 mr-1">$</span>
                                {metrics.stopLoss.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </p>
                        )}
                    </div>
                    <div className="mt-4 text-[10px] font-bold text-white bg-[#0F172A] border-2 border-white px-2 py-1 uppercase shadow-[2px_2px_0px_rgba(255,255,255,1)] text-center break-words">
                        BATASI RISIKO KERUGIAN
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MetricCards;
