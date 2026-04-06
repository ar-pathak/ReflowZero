import React from 'react';
import ReactECharts from 'echarts-for-react';

export const CoinModal = ({ coin, onClose }) => {
    if (!coin) return null;

    const isUp = coin.priceHistory[coin.priceHistory.length - 1] >= coin.priceHistory[0];
    const color = isUp ? '#4ade80' : '#f87171'; // Tailwind green-400 : red-400

    // Bada aur detailed chart configuration
    const option = {
        animation: false,
        tooltip: {
            trigger: 'axis',
            backgroundColor: '#1f2937', // bg-gray-800
            textStyle: { color: '#fff' },
            borderWidth: 0,
        },
        grid: { left: '8%', right: '5%', top: '10%', bottom: '15%' },
        xAxis: {
            type: 'category',
            data: coin.priceHistory.map((_, i) => `T-${coin.priceHistory.length - i}`),
            axisLine: { lineStyle: { color: '#374151' } },
            axisLabel: { color: '#9ca3af' },
        },
        yAxis: {
            type: 'value',
            min: 'dataMin',
            max: 'dataMax',
            splitLine: { lineStyle: { color: '#374151', type: 'dashed' } },
            axisLabel: { color: '#9ca3af' },
        },
        series: [
            {
                data: coin.priceHistory,
                type: 'line',
                smooth: true,
                symbolSize: 6, // Points par hover karne ke liye dots
                itemStyle: { color: color },
                areaStyle: {
                    // Niche ki taraf fade hota hua gradient effect
                    color: {
                        type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: color }, // Start (solid)
                            { offset: 1, color: 'transparent' } // End (transparent)
                        ]
                    },
                    opacity: 0.2
                }
            }
        ]
    };

    return (
        // Background Overlay (Blur effect ke sath)
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={onClose} // Bahar click karne par band hoga
        >
            {/* Modal Card */}
            <div
                className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-4xl p-6"
                onClick={(e) => e.stopPropagation()} // Andar click karne par band nahi hoga
            >
                <div className="flex justify-between items-start mb-6 border-b border-gray-800 pb-4">
                    <div>
                        <h2 className="text-3xl font-bold text-white tracking-widest">{coin.symbol}</h2>
                        <p className="text-gray-400 text-sm mt-1">Live Market Stream (Last 20 ticks)</p>
                    </div>
                    <div className="text-right">
                        <button onClick={onClose} className="text-gray-500 hover:text-white mb-2 font-bold text-xl">
                            ✕
                        </button>
                        <div className={`text-3xl font-mono font-bold ${isUp ? 'text-green-400' : 'text-red-400'}`}>
                            {Number(coin.closePrice).toFixed(4)}
                        </div>
                    </div>
                </div>

                {/* The Big Chart */}
                <div className="bg-gray-800 rounded-xl p-2 border border-gray-700 mb-6">
                    <ReactECharts
                        option={option}
                        opts={{ renderer: 'canvas' }}
                        style={{ height: '350px', width: '100%' }}
                    />
                </div>

                {/* Bottom Stats Grid */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 text-center">
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">24h High</p>
                        <p className="font-mono text-green-400 text-lg">{Number(coin.highPrice).toFixed(4)}</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 text-center">
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">24h Low</p>
                        <p className="font-mono text-red-400 text-lg">{Number(coin.lowPrice).toFixed(4)}</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 text-center">
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Volume</p>
                        <p className="font-mono text-blue-400 text-lg">{Number(coin.volume).toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};