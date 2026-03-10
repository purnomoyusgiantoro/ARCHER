import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="p-4 md:p-6 border-b-4 border-black bg-white sticky top-0 z-50">
            <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                {/* Logo Only */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#FFD700] border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter">
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                    </div>
                    <div className="flex flex-col leading-none">
                        <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-black">
                            CRYPTO<span className="text-[#FF5722]">ARCHER</span>
                        </h1>
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400">Advanced Dashboard</span>
                    </div>
                </div>

                {/* Status Dot */}
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse border-2 border-black" />
                    <span className="text-[10px] font-black uppercase tracking-widest">System Live</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
