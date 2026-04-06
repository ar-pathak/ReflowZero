import { useState, useEffect, useRef } from 'react';

const BINANCE_WS_URL = 'wss://stream.binance.com:9443/ws/!miniTicker@arr';

export const useBinanceSocket = (throttleMs = 1000) => {
  const [data, setData] = useState([]);
  const latestDataRef = useRef([]);
  const historyRef = useRef({}); // Har coin ki last 20 prices store karne ke liye

  useEffect(() => {
    const ws = new WebSocket(BINANCE_WS_URL);

    ws.onopen = () => console.log('🟢 Connected to Binance WebSocket');
    ws.onmessage = (event) => {
      latestDataRef.current = JSON.parse(event.data);
    };
    ws.onerror = (error) => console.error('🔴 WebSocket Error:', error);

    const interval = setInterval(() => {
      if (latestDataRef.current.length > 0) {
        const formattedData = latestDataRef.current.map(item => {
          const symbol = item.s;
          const currentPrice = Number(item.c);

          // Agar coin ki history nahi hai, toh empty array banao
          if (!historyRef.current[symbol]) {
            historyRef.current[symbol] = [];
          }

          const history = historyRef.current[symbol];
          
          // Nayi price history mein dalo, aur sirf last 20 points save rakho
          history.push(currentPrice);
          if (history.length > 20) {
            history.shift(); 
          }

          return {
            symbol: symbol,
            closePrice: currentPrice,
            openPrice: item.o,
            highPrice: item.h,
            lowPrice: item.l,
            volume: item.v,
            priceHistory: [...history], // Chart ke liye history array
          };
        });
        
        setData(formattedData);
      }
    }, throttleMs);

    return () => {
      ws.close();
      clearInterval(interval);
    };
  }, [throttleMs]);

  return data;
};