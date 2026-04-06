import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

export const MarketTable = ({ data }) => {
    // Parent container ka reference jisme scroll hoga
    const parentRef = useRef(null);

    // TanStack Virtualizer setup
    const rowVirtualizer = useVirtualizer({
        count: data.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 40, // Har row ki height lagbhag 40px hai
        overscan: 5, // Smooth scrolling ke liye screen ke bahar 5 rows extra render karega
    });

    if (data.length === 0) {
        return <div className="text-center text-gray-400 p-8">Waiting for market data...</div>;
    }

    return (
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
            {/* Table Header (Fixed) */}
            <div className="grid grid-cols-4 md:grid-cols-6 gap-4 p-4 border-b border-gray-700 bg-gray-900 font-semibold text-gray-400 text-sm">
                <div>Symbol</div>
                <div className="text-right">Price</div>
                <div className="text-right hidden md:block">24h High</div>
                <div className="text-right hidden md:block">24h Low</div>
                <div className="text-right">Volume</div>
            </div>

            {/* Scrollable Container */}
            <div
                ref={parentRef}
                className="h-[500px] overflow-auto custom-scrollbar"
                style={{ contain: 'strict' }} // DOM optimization: Browser ko batata hai ki yeh element baaki layout ko affect nahi karega
            >
                {/* Total height of all virtual rows */}
                <div
                    style={{
                        height: `${rowVirtualizer.getTotalSize()}px`,
                        width: '100%',
                        position: 'relative',
                    }}
                >
                    {/* Render only visible rows */}
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                        const coin = data[virtualRow.index];
                        return (
                            <div
                                key={coin.symbol}
                                className="absolute top-0 left-0 w-full grid grid-cols-4 md:grid-cols-6 gap-4 p-4 border-b border-gray-700 hover:bg-gray-750 transition-colors text-sm items-center"
                                style={{
                                    height: `${virtualRow.size}px`,
                                    transform: `translateY(${virtualRow.start}px)`, // Row ko uski sahi position par rakhta hai
                                }}
                            >
                                <div className="font-bold text-blue-400">{coin.symbol}</div>
                                <div className="text-right font-mono text-gray-200">{Number(coin.closePrice).toFixed(4)}</div>
                                <div className="text-right font-mono text-green-400 hidden md:block">{Number(coin.highPrice).toFixed(4)}</div>
                                <div className="text-right font-mono text-red-400 hidden md:block">{Number(coin.lowPrice).toFixed(4)}</div>
                                <div className="text-right font-mono text-gray-400">{Number(coin.volume).toFixed(2)}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};