import React from 'react';
import { COINS } from '../config/coins';

const Header = ({ selectedCoin, setSelectedCoin, days, setDays }) => {
    const timeframes = [
        { id: '1', label: '1 Hari', color: 'bg-[#FFD700]' },
        { id: '7', label: '1 Minggu', color: 'bg-[#00E5FF]' },
        { id: '30', label: '1 Bulan', color: 'bg-[#FF5722]' },
    ];

    return (
        <nav className="p-6 relative z-10 flex flex-col md:flex-row justify-between items-center border-b-4 border-black mb-8 bg-white gap-4">
            <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#FFD700] border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter">
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-black uppercase tracking-tighter text-black">
                        CRYPTO<span className="text-[#FF5722]">ARCHER</span>
                    </h1>
                </div>

                {/* Coin Selector */}
                <div className="flex gap-2">
                    {COINS.map(coin => (
                        <button
                            key={coin.id}
                            onClick={() => setSelectedCoin(coin.id)}
                            className={`px-3 py-2 text-sm font-black border-4 border-black uppercase transition-all duration-75 flex items-center gap-2 ${selectedCoin === coin.id
                                    ? `${coin.bg} translate-y-1 translate-x-1 shadow-none`
                                    : 'bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:bg-gray-100 active:translate-y-1 active:translate-x-1 active:shadow-none'
                                }`}
                        >
                            <img
                                src={coin.logo}
                                alt={coin.symbol}
                                className="w-4 h-4 object-contain"
                            />
                            <span>{coin.symbol}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Timeframe Selector */}
            <div className="flex gap-2 w-full md:w-auto justify-center md:justify-end">
                {timeframes.map(d => (
                    <button
                        key={d.id}
                        onClick={() => setDays(d.id)}
                        className={`px-5 py-2 text-sm font-black border-4 border-black uppercase transition-all duration-75 flex-1 md:flex-none ${days === d.id
                                ? `${d.color} translate-y-1 translate-x-1 shadow-none`
                                : 'bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:bg-gray-100 active:translate-y-1 active:translate-x-1 active:shadow-none'
                            }`}
                    >
                        {d.label}
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default Header;
