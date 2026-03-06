import React from 'react';

const SkeletonBlock = ({ className = '' }) => (
    <div className={`bg-black/10 animate-pulse ${className}`} />
);

// ── Helpers ──────────────────────────────────────────────────────────────────

const biasColor = {
    bull: 'text-green-700',
    bear: 'text-red-700',
    neutral: 'text-gray-700',
};

const CardWrapper = ({ bg = 'bg-white', children }) => (
    <div className={`${bg} border-4 border-black p-5 shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_rgba(0,0,0,1)] transition-all flex flex-col gap-3`}>
        {children}
    </div>
);

const CardTitle = ({ icon, label }) => (
    <div className="flex items-center justify-between border-b-4 border-black pb-3">
        <p className="text-xs uppercase font-black tracking-widest">{label}</p>
        {icon}
    </div>
);

const StatusBadge = ({ text, bias = 'neutral', bg }) => (
    <div className={`${bg || 'bg-white'} border-2 border-black px-2 py-1 text-[10px] font-black uppercase tracking-wider text-center ${biasColor[bias]}`}>
        {text}
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────

const AdvancedMetrics = ({ metrics, isLoading }) => {
    const { atr, trendStrength, liquidityZones, smartMoney, fakeBreakout } = metrics;

    // ── ATR Volatility ────────────────────────────────────────────────────────
    const atrCard = (
        <CardWrapper bg="bg-black">
            <CardTitle
                label={<span className="text-white">ATR Volatility</span>}
                icon={<svg className="w-5 h-5 text-[#FFD700] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
            />
            {isLoading || !atr ? (
                <SkeletonBlock className="h-8 w-3/4 bg-white/20" />
            ) : (
                <>
                    <p className="text-3xl font-black font-mono text-[#FFD700] tracking-tighter">
                        ${atr.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        <span className="text-sm text-white/60 ml-2">({atr.pct.toFixed(2)}%)</span>
                    </p>
                    <div className="flex items-center gap-2">
                        <div className={`px-2 py-1 border-2 border-[#FFD700] text-[10px] font-black uppercase text-[#FFD700]`}>
                            {atr.label}
                        </div>
                        <div className="text-[10px] text-white/60 font-bold uppercase">
                            Tren: {atr.trend}
                        </div>
                    </div>
                </>
            )}
        </CardWrapper>
    );

    // ── Real Liquidity Zone ───────────────────────────────────────────────────
    const liqCard = (
        <CardWrapper bg="bg-[#b4e636]">
            <CardTitle
                label="Real Liquidity Zone"
                icon={<svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002-2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
            />
            {isLoading || !liquidityZones ? (
                <>
                    <SkeletonBlock className="h-6 w-full" />
                    <SkeletonBlock className="h-6 w-full" />
                </>
            ) : (
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center bg-[#FF5722] border-2 border-black px-3 py-1.5">
                        <span className="text-[10px] font-black uppercase text-white">RES</span>
                        <span className="font-mono text-sm font-black text-white">
                            {liquidityZones.resistance ? `$${liquidityZones.resistance.toLocaleString()}` : '—'}
                            {liquidityZones.resistanceCount > 1 && <span className="text-[10px] ml-1 text-white/70">×{liquidityZones.resistanceCount}</span>}
                        </span>
                    </div>
                    <div className="flex justify-between items-center bg-white border-2 border-black px-3 py-1.5">
                        <span className="text-[10px] font-black uppercase text-black">SUP</span>
                        <span className="font-mono text-sm font-black text-black">
                            {liquidityZones.support ? `$${liquidityZones.support.toLocaleString()}` : '—'}
                            {liquidityZones.supportCount > 1 && <span className="text-[10px] ml-1 text-gray-500">×{liquidityZones.supportCount}</span>}
                        </span>
                    </div>
                </div>
            )}
        </CardWrapper>
    );

    // ── Trend Strength ────────────────────────────────────────────────────────
    const trendCard = (
        <CardWrapper bg="bg-[#FFD700]">
            <CardTitle
                label="Trend Strength"
                icon={<svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>}
            />
            {isLoading ? (
                <SkeletonBlock className="h-8 w-3/4" />
            ) : (
                <>
                    <p className="text-3xl font-black font-mono text-black tracking-tighter">
                        {trendStrength.score}<span className="text-black/40 text-xl font-sans"> /100</span>
                    </p>
                    {/* Progress bar */}
                    <div className="w-full h-3 bg-black/20 border-2 border-black overflow-hidden">
                        <div
                            className={`h-full transition-all ${trendStrength.direction === 'bull' ? 'bg-black' : trendStrength.direction === 'bear' ? 'bg-[#FF5722]' : 'bg-gray-600'}`}
                            style={{ width: `${trendStrength.score}%` }}
                        />
                    </div>
                    <StatusBadge text={trendStrength.label} bias={trendStrength.direction} />
                </>
            )}
        </CardWrapper>
    );

    // ── Smart Money Detection ─────────────────────────────────────────────────
    const smCard = (
        <CardWrapper bg="bg-[#00E5FF]">
            <CardTitle
                label="Smart Money"
                icon={<svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" /></svg>}
            />
            {isLoading ? (
                <>
                    <SkeletonBlock className="h-6 w-1/2" />
                    <SkeletonBlock className="h-4 w-full" />
                    <SkeletonBlock className="h-4 w-5/6" />
                </>
            ) : (
                <>
                    <div className={`inline-block px-3 py-1 border-2 border-black text-sm font-black uppercase bg-black text-[#00E5FF]`}>
                        {smartMoney.signal}
                    </div>
                    <p className="text-[11px] font-bold leading-relaxed text-black">
                        {smartMoney.description}
                    </p>
                </>
            )}
        </CardWrapper>
    );

    // ── Fake Breakout Filter ──────────────────────────────────────────────────
    const fbCard = (
        <CardWrapper bg="bg-[#FF5722]">
            <CardTitle
                label={<span className="text-white">Fake Breakout</span>}
                icon={<svg className="w-5 h-5 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>}
            />
            {isLoading ? (
                <>
                    <SkeletonBlock className="h-6 w-1/2 bg-white/20" />
                    <SkeletonBlock className="h-4 w-full bg-white/20" />
                    <SkeletonBlock className="h-4 w-5/6 bg-white/20" />
                </>
            ) : (
                <>
                    <div className="inline-block px-3 py-1 border-2 border-white text-sm font-black uppercase bg-black text-white">
                        {fakeBreakout.signal}
                    </div>
                    <p className="text-[11px] font-bold leading-relaxed text-white">
                        {fakeBreakout.description}
                    </p>
                </>
            )}
        </CardWrapper>
    );

    return (
        <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
                <div className="h-1 w-12 bg-black" />
                <h3 className="text-2xl font-black uppercase tracking-tighter text-black">Analisis Lanjutan</h3>
                <div className="h-1 flex-1 bg-black" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {atrCard}
                {liqCard}
                {trendCard}
                {smCard}
                {fbCard}
            </div>
        </div>
    );
};

export default AdvancedMetrics;
