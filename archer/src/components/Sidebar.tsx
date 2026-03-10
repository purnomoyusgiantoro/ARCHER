import React from 'react';
import { COINS } from '../config/coins';

interface SidebarProps {
    selectedCoin: string;
    setSelectedCoin: (coin: string) => void;
    days: string;
    setDays: (days: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedCoin, setSelectedCoin, days, setDays }) => {
    const updatedTimeframes = [
        { id: '1', label: '1 Hari', color: 'bg-[#FFD700]' },
        { id: '4h', label: '4 Jam', color: 'bg-[#b4e636]' },
        { id: '7', label: '1 Minggu', color: 'bg-[#00E5FF]' },
        { id: '30', label: '1 Bulan', color: 'bg-[#FF5722]' },
    ];

    return (
        <aside className="w-full lg:w-72 flex flex-col gap-8 p-6 bg-white border-b-4 lg:border-b-0 lg:border-r-4 border-black h-fit lg:h-[calc(100vh-80px)] lg:sticky lg:top-20 overflow-y-auto no-scrollbar shrink-0">
            {/* Coin Selector Section */}
            <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4 border-b-2 border-black pb-1">
                    Pilih Aset
                </h3>
                <div className="flex flex-col gap-2">
                    {COINS.map(coin => (
                        <button
                            key={coin.id}
                            onClick={() => setSelectedCoin(coin.id)}
                            className={`px-4 py-3 text-sm font-black border-4 border-black uppercase transition-all duration-75 flex items-center justify-between group ${selectedCoin === coin.id
                                ? `${coin.bg} translate-y-1 translate-x-1 shadow-none`
                                : 'bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:bg-gray-100 active:translate-y-1 active:translate-x-1 active:shadow-none'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <img
                                    src={coin.logo}
                                    alt={coin.symbol}
                                    className="w-5 h-5 object-contain"
                                />
                                <span>{coin.name}</span>
                            </div>
                            <span className="text-[10px] opacity-50 font-mono">{coin.symbol}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Timeframe Selector Section */}
            <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4 border-b-2 border-black pb-1">
                    Waktu Analisis
                </h3>
                <div className="grid grid-cols-2 gap-2">
                    {updatedTimeframes.map(d => (
                        <button
                            key={d.id}
                            onClick={() => setDays(d.id)}
                            className={`px-3 py-3 text-[10px] font-black border-4 border-black uppercase transition-all duration-75 ${days === d.id
                                ? `${d.color} translate-y-1 translate-x-1 shadow-none`
                                : 'bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:bg-gray-100 active:translate-y-1 active:translate-x-1 active:shadow-none'
                                }`}
                        >
                            {d.label}
                        </button>
                    ))}
                </div>
            </div>

        </aside>
    );
};

export default Sidebar;
