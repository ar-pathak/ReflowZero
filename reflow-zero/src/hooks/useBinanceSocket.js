import { useState, useEffect, useRef } from 'react';

// !miniTicker@arr streams 24hr rolling window mini-ticker statistics for all symbols.
// Ye massive data table ke liye sabse best stream hai.
const BINANCE_WS_URL = 'wss://stream.binance.com:9443/ws/!miniTicker@arr';

export const useBinanceSocket = (throttleMs = 1000) => {
    const [data, setData] = useState([]);

    // useRef re-renders trigger nahi karta, isliye incoming fast data hum yahan store karenge
    const latestDataRef = useRef([]);

    useEffect(() => {
        const ws = new WebSocket(BINANCE_WS_URL);

        ws.onopen = () => {
            console.log('🟢 Connected to Binance WebSocket');
        };

        ws.onmessage = (event) => {
            const parsedData = JSON.parse(event.data);
            // Naye data ko silently Ref mein daal do (UI freeze nahi hoga)
            latestDataRef.current = parsedData;
        };

        ws.onerror = (error) => {
            console.error('🔴 WebSocket Error:', error);
        };

        ws.onclose = () => {
            console.log('🔴 Disconnected from Binance WebSocket');
        };

        // The Throttle: Har 'throttleMs' (e.g., 1000ms) baad React state ko update karo
        const interval = setInterval(() => {
            if (latestDataRef.current.length > 0) {
                // Map karke data ko thoda clean aur format kar lete hain
                const formattedData = latestDataRef.current.map(item => ({
                    symbol: item.s,           // Symbol (e.g., BTCUSDT)
                    closePrice: item.c,       // Latest price
                    openPrice: item.o,        // Open price
                    highPrice: item.h,        // High price
                    lowPrice: item.l,         // Low price
                    volume: item.v,           // Volume
                }));

                setData(formattedData);
            }
        }, throttleMs);

        // Cleanup function: Jab component unmount ho toh connection close kar do
        return () => {
            ws.close();
            clearInterval(interval);
        };
    }, [throttleMs]);

    return data;
};