import React from 'react';

const SkeletonBlock = ({ className = '' }) => (
    <div className={`bg-black/10 animate-pulse ${className}`} />
);

const ProjectionCards = ({ projections, metrics, isLoading }) => {
    const cards = [
        {
            key: 'day',
            badge: 'Hari Ini (1D)',
            badgeBg: 'bg-[#FFD700]',
            badgeText: 'text-black',
            text: projections.projectionDay,
            placeholder: 'Memuat prediksi harian...',
        },
        {
            key: 'week',
            badge: 'Minggu Ini (1W)',
            badgeBg: 'bg-[#00E5FF]',
            badgeText: 'text-black',
            text: projections.projectionWeek,
            placeholder: 'Memuat prediksi mingguan...',
        },
        {
            key: 'month',
            badge: 'Bulan Ini (1M)',
            badgeBg: 'bg-[#FF5722]',
            badgeText: 'text-[#FFF0E5]',
            text: projections.projectionMonth,
            placeholder: 'Memuat prediksi bulanan...',
        },
    ];

    return (
        <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
                <div className="h-1 w-12 bg-black" />
                <h3 className="text-2xl font-black uppercase tracking-tighter text-black">Proyeksi Masa Depan</h3>
                <div className="h-1 flex-1 bg-black" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map(card => (
                    <div
                        key={card.key}
                        className="bg-white border-4 border-black p-5 shadow-[6px_6px_0px_rgba(0,0,0,1)] flex flex-col justify-between hover:-translate-y-1 hover:shadow-[10px_10px_0px_rgba(0,0,0,1)] transition-all"
                    >
                        <div>
                            <div className={`inline-block ${card.badgeBg} border-2 border-black px-3 py-1 mb-3`}>
                                <p className={`text-xs font-black uppercase tracking-widest ${card.badgeText}`}>
                                    {card.badge}
                                </p>
                            </div>

                            {isLoading ? (
                                <div className="space-y-2 mb-4">
                                    <SkeletonBlock className="h-3 w-full" />
                                    <SkeletonBlock className="h-3 w-5/6" />
                                    <SkeletonBlock className="h-3 w-4/6" />
                                </div>
                            ) : (
                                <p className="text-sm font-bold leading-relaxed text-black mb-4">
                                    {card.text || card.placeholder}
                                </p>
                            )}
                        </div>

                        {/* Target & Support — digabung dalam 1 baris, dipisah di tengah */}
                        <div className="mt-4 pt-4 border-t-4 border-black border-dashed">
                            {isLoading ? (
                                <SkeletonBlock className="h-8 w-full" />
                            ) : (
                                <div className="flex overflow-hidden border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                                    <div className="flex-1 bg-[#00E5FF] px-3 py-2 text-center border-r-2 border-black">
                                        <p className="text-[9px] font-black uppercase tracking-wider text-black">Target</p>
                                        <p className="font-mono text-sm font-black text-black leading-tight">
                                            ${metrics.targetHigh.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </p>
                                    </div>
                                    <div className="flex-1 bg-[#FF5722] px-3 py-2 text-center">
                                        <p className="text-[9px] font-black uppercase tracking-wider text-[#FFF0E5]">Support</p>
                                        <p className="font-mono text-sm font-black text-[#FFF0E5] leading-tight">
                                            ${metrics.targetLow.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectionCards;
