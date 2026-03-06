import React from 'react';

const SkeletonBlock = ({ className = '' }) => (
    <div className={`bg-black/10 animate-pulse ${className}`} />
);

const MetricCards = ({ metrics, isLoading }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

            {/* EMA TREND CARD */}
            <div className="bg-[#00E5FF] border-4 border-black p-6 shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_rgba(0,0,0,1)] transition-all flex flex-col justify-between overflow-hidden">
                <div>
                    <div className="flex items-center justify-between mb-3 border-b-4 border-black pb-3">
                        <p className="text-xs uppercase text-black font-black tracking-widest">Arah Tren (EMA)</p>
                        <svg className="w-5 h-5 text-black shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                        </svg>
                    </div>
                    {isLoading ? (
                        <SkeletonBlock className="h-9 w-3/4 mb-1" />
                    ) : (
                        <p className="text-3xl font-black font-mono text-black tracking-tighter truncate">
                            <span className="text-black/50 mr-1">$</span>
                            {metrics.ema.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </p>
                    )}
                </div>
                <div className="mt-4 text-[10px] font-bold text-black bg-white border-2 border-black px-2 py-1 shadow-[2px_2px_0px_rgba(0,0,0,1)] text-center break-words">
                    {isLoading ? <SkeletonBlock className="h-3 w-full" /> : (
                        metrics.currentPrice > metrics.ema ? 'HARGA DI ATAS EMA (UPTREND)' : 'HARGA DI BAWAH EMA (DNTREND)'
                    )}
                </div>
            </div>

            {/* RSI CARD */}
            <div className="bg-[#FFD700] border-4 border-black p-6 shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_rgba(0,0,0,1)] transition-all flex flex-col justify-between overflow-hidden">
                <div>
                    <div className="flex items-center justify-between mb-3 border-b-4 border-black pb-3">
                        <p className="text-xs uppercase text-black font-black tracking-widest">Momentum (RSI)</p>
                        <svg className="w-5 h-5 text-black shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002-2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    {isLoading ? (
                        <SkeletonBlock className="h-9 w-1/2 mb-1" />
                    ) : (
                        <p className="text-3xl font-black font-mono text-black tracking-tighter">
                            {metrics.rsi.toFixed(1)} <span className="text-black/50 text-xl font-sans font-bold">/100</span>
                        </p>
                    )}
                </div>
                <div className="mt-4 text-[10px] font-bold text-black bg-white border-2 border-black px-2 py-1 uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)] text-center break-words">
                    {isLoading ? <SkeletonBlock className="h-3 w-full" /> : (
                        metrics.rsi < 35 ? 'Extremely Oversold (Jenuh Jual)' : metrics.rsi > 70 ? 'Extremely Overbought (Titik Puncak)' : 'Fase Netral'
                    )}
                </div>
            </div>

            {/* MARKET SIGNAL CARD */}
            <div className="bg-[#FF5722] border-4 border-black p-6 shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_rgba(0,0,0,1)] transition-all flex flex-col justify-between overflow-hidden">
                <div>
                    <div className="flex items-center justify-between mb-3 border-b-4 border-black pb-3">
                        <p className="text-xs uppercase text-black font-black tracking-widest">Sinyal Teknis</p>
                        <svg className="w-5 h-5 text-black shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    {isLoading ? (
                        <SkeletonBlock className="h-8 w-full mb-1" />
                    ) : (
                        <p className="text-xl leading-tight font-black uppercase text-black tracking-tighter break-words">
                            {metrics.status}
                        </p>
                    )}
                </div>
                <div className="mt-4 bg-black p-2 border-2 border-dashed border-white flex-1 flex items-center justify-center">
                    {isLoading ? (
                        <SkeletonBlock className="h-3 w-full bg-white/20" />
                    ) : (
                        <p className="text-[10px] sm:text-xs font-black tracking-widest text-[#FFF0E5] text-center">
                            {metrics.signal}
                        </p>
                    )}
                </div>
            </div>

            {/* TARGET TERBAWAH CARD */}
            <div className="bg-[#b4e636] border-4 border-black p-6 shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_rgba(0,0,0,1)] transition-all flex flex-col justify-between overflow-hidden">
                <div>
                    <div className="flex items-center justify-between mb-3 border-b-4 border-black pb-3">
                        <p className="text-xs uppercase text-black font-black tracking-widest">Target Terbawah</p>
                        <svg className="w-5 h-5 text-black shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                    {isLoading ? (
                        <SkeletonBlock className="h-9 w-3/4 mb-1" />
                    ) : (
                        <p className="text-3xl font-black font-mono text-black tracking-tighter">
                            <span className="text-black/50 mr-1">$</span>
                            {metrics.targetLow.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </p>
                    )}
                </div>
                <div className="mt-4 text-[10px] font-bold text-black bg-white border-2 border-black px-2 py-1 uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)] text-center break-words">
                    Rekomendasi Area Beli Paling Rendah
                </div>
            </div>
        </div>
    );
};

export default MetricCards;
