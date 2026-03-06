import React, { useState } from 'react';

const TokenHeader = ({ currentCoinObj, address }) => {
    const [copied, setCopied] = useState(false);

    const copyAddress = () => {
        navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="mb-10 p-6 bg-white border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Coin Identity */}
            <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-start">
                <div className={`w-14 h-14 ${currentCoinObj.bg} border-4 border-black flex items-center justify-center p-2 shadow-[4px_4px_0px_rgba(0,0,0,1)]`}>
                    <img src={currentCoinObj.logo} alt={currentCoinObj.symbol} className="w-full h-full object-contain" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-black uppercase tracking-tight">
                        {currentCoinObj.name} <span className="text-gray-500 text-sm font-bold">{currentCoinObj.symbol}</span>
                    </h2>
                    <div className="flex items-center gap-3 mt-2">
                        <span className={`text-xs font-black text-black uppercase ${currentCoinObj.bg} px-3 py-1 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]`}>
                            Active
                        </span>
                        <span className="text-xs font-bold text-gray-600 uppercase border-b-2 border-black">
                            {currentCoinObj.network}
                        </span>
                    </div>
                </div>
            </div>

            {/* Address Section */}
            <div className="flex flex-col items-center md:items-end w-full md:w-auto mt-4 md:mt-0">
                <span className="text-sm text-black font-black mb-2 uppercase tracking-widest bg-[#FFD700] px-2 py-1 border-2 border-black">
                    Network Address
                </span>
                <button
                    onClick={copyAddress}
                    title={address}
                    className="group flex flex-1 w-full justify-between sm:justify-center items-center gap-3 bg-white border-4 border-black px-4 py-2 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform active:translate-y-1 active:translate-x-1 active:shadow-none"
                >
                    <span className="font-mono text-sm font-bold text-black group-hover:text-[#FF5722] transition-colors">
                        {address.slice(0, 8)}...{address.slice(-6)}
                    </span>
                    {copied ? (
                        <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="4" d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
};

export default TokenHeader;
