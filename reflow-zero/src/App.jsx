import { useState, useMemo } from 'react';
import { useBinanceSocket } from './hooks/useBinanceSocket';
import { MarketTable } from './features/MarketTable';

function App() {
  const tickers = useBinanceSocket(1000); 
  const [searchQuery, setSearchQuery] = useState('');

  // Performance Optimization: Search aur Sorting logic ko memoize kar diya
  // Ye sirf tab run hoga jab 'tickers' ya 'searchQuery' change ho
  const filteredAndSortedTickers = useMemo(() => {
    let processedData = tickers;

    // 1. Search Logic
    if (searchQuery) {
      processedData = processedData.filter(coin => 
        coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 2. Default Sort Logic (Highest Volume first)
    // Hum chahte hain ki by default sabse active coins upar dikhein
    processedData = [...processedData].sort((a, b) => Number(b.volume) - Number(a.volume));

    return processedData;
  }, [tickers, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <header className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-wider text-blue-400">ReflowZero</h1>
          <p className="text-gray-400 text-sm mt-1">High-Performance WebSocket Pipeline</p>
        </div>
        
        {/* Sleek Search Bar */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Search coin (e.g. BTC)..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-800 text-white border border-gray-700 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 transition-colors w-full md:w-64"
          />
          <div className="text-right shrink-0">
            <span className="text-xs text-gray-500 block">Active Streams</span>
            <span className="font-mono text-green-400 text-lg">{tickers.length}</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {/* Ab hum filtered data pass kar rahe hain */}
        <MarketTable data={filteredAndSortedTickers} />
      </main>
    </div>
  );
}

export default App;