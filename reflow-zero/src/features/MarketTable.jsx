import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Sparkline } from '../components/Sparkline';
// Redux Hooks aur Action import karein
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../store/watchlistSlice';

export const MarketTable = ({ data, onRowClick }) => {
    const parentRef = useRef(null);

    // Redux se favorites list nikalein aur dispatch function setup karein
    const dispatch = useDispatch();
    const favorites = useSelector((state) => state.watchlist.favorites);

    const rowVirtualizer = useVirtualizer({
        count: data.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 56,
        overscan: 5,
    });

    if (data.length === 0) {
        return <div className="text-center text-gray-400 p-8">Waiting for market data...</div>;
    }

    return (
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
            {/* Table Header: Ek extra column 'Fav' add kiya */}
            <div className="grid grid-cols-5 md:grid-cols-7 lg:grid-cols-8 gap-4 p-4 border-b border-gray-700 bg-gray-900 font-semibold text-gray-400 text-sm items-center">
                <div className="text-center w-8">Fav</div>
                <div>Symbol</div>
                <div className="text-right">Price</div>
                <div className="text-center hidden lg:block">Trend (Last 20s)</div>
                <div className="text-right hidden md:block">24h High</div>
                <div className="text-right hidden md:block">24h Low</div>
                <div className="text-right">Volume</div>
            </div>

            {/* Scrollable Container */}
            <div ref={parentRef} className="h-[600px] overflow-auto custom-scrollbar" style={{ contain: 'strict' }}>
                <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                        const coin = data[virtualRow.index];
                        const isFav = favorites.includes(coin.symbol); // Check karein ki coin favorite hai ya nahi

                        return (
                            <div
                                key={coin.symbol}
                                onClick={() => onRowClick(coin.symbol)}
                                className="absolute top-0 left-0 w-full grid grid-cols-5 md:grid-cols-7 lg:grid-cols-8 gap-4 px-4 border-b border-gray-700 hover:bg-gray-750 transition-colors text-sm items-center cursor-pointer"
                                style={{
                                    height: `${virtualRow.size}px`,
                                    transform: `translateY(${virtualRow.start}px)`,
                                }}
                            >
                                {/* ⭐ Star Button */}
                                <div
                                    className="flex justify-center items-center w-8"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Yeh zaroori hai taaki star par click karne se modal open na ho
                                        dispatch(toggleFavorite(coin.symbol));
                                    }}
                                >
                                    <button className={`text-xl transition-transform hover:scale-110 ${isFav ? 'text-yellow-400' : 'text-gray-600'}`}>
                                        {isFav ? '★' : '☆'}
                                    </button>
                                </div>

                                <div className="font-bold text-blue-400">{coin.symbol}</div>
                                <div className="text-right font-mono text-gray-200">{Number(coin.closePrice).toFixed(4)}</div>

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