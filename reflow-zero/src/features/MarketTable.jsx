import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Sparkline } from '../components/Sparkline';

export const MarketTable = ({ data }) => {
    const parentRef = useRef(null);

    const rowVirtualizer = useVirtualizer({
        count: data.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 56, // Row height thodi badha di chart ke liye
        overscan: 5,
    });

    if (data.length === 0) {
        return <div className="text-center text-gray-400 p-8">Waiting for market data...</div>;
    }

    return (
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
            {/* Table Header: Grid columns update kiye hain */}
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-4 p-4 border-b border-gray-700 bg-gray-900 font-semibold text-gray-400 text-sm items-center">
                <div>Symbol</div>
                <div className="text-right">Price</div>
                <div className="text-center hidden lg:block">Trend (Last 20s)</div>
                <div className="text-right hidden md:block">24h High</div>
                <div className="text-right hidden md:block">24h Low</div>
                <div className="text-right">Volume</div>
            </div>

            <div ref={parentRef} className="h-[600px] overflow-auto custom-scrollbar" style={{ contain: 'strict' }}>
                <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                        const coin = data[virtualRow.index];
                        return (
                            <div
                                key={coin.symbol}
                                className="absolute top-0 left-0 w-full grid grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-4 px-4 border-b border-gray-700 hover:bg-gray-750 transition-colors text-sm items-center"
                                style={{
                                    height: `${virtualRow.size}px`,
                                    transform: `translateY(${virtualRow.start}px)`,
                                }}
                            >
                                <div className="font-bold text-blue-400">{coin.symbol}</div>
                                <div className="text-right font-mono text-gray-200">{Number(coin.closePrice).toFixed(4)}</div>

                                {/* Live Sparkline Chart Component */}
                                <div className="hidden lg:flex justify-center items-center">
                                    {coin.priceHistory.length > 1 ? (
                                        <Sparkline data={coin.priceHistory} />
                                    ) : (
                                        <span className="text-xs text-gray-600">Loading...</span>
                                    )}
                                </div>

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