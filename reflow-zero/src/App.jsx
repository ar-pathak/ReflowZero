import { useState, useMemo, useEffect } from 'react';
import { useBinanceSocket } from './hooks/useBinanceSocket';
import { MarketTable } from './features/MarketTable';
import { CoinModal } from './components/CoinModal'; // Modal Import kiya

function App() {
  const tickers = useBinanceSocket(1000);
  const [searchQuery, setSearchQuery] = useState('');
  const [stableSymbols, setStableSymbols] = useState([]);

  // Naya State: Modal ke liye kaunsa coin selected hai
  const [selectedSymbol, setSelectedSymbol] = useState(null);

  useEffect(() => {
    if (tickers.length > 0 && stableSymbols.length === 0) {
      const initialSortedSymbols = [...tickers]
        .sort((a, b) => Number(b.volume) - Number(a.volume))
        .map(coin => coin.symbol);
      setStableSymbols(initialSortedSymbols);
    }
  }, [tickers, stableSymbols.length]);

  const filteredAndSortedTickers = useMemo(() => {
    if (stableSymbols.length === 0) return [];
    const tickerMap = new Map(tickers.map(coin => [coin.symbol, coin]));
    let processedData = stableSymbols
      .map(symbol => tickerMap.get(symbol))
      .filter(Boolean);

    if (searchQuery) {
      processedData = processedData.filter(coin =>
        coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return processedData;
  }, [tickers, searchQuery, stableSymbols]);

  // Modal ko real-time rakhne ke liye latest data fetch kar rahe hain
  const activeModalCoin = useMemo(() => {
    if (!selectedSymbol) return null;
    return tickers.find(t => t.symbol === selectedSymbol);
  }, [tickers, selectedSymbol]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      {/* Header and Search remain the same... */}
      <header className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-wider text-blue-400">ReflowZero</h1>
          <p className="text-gray-400 text-sm mt-1">High-Performance WebSocket Pipeline</p>
        </div>

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

      <main className="max-w-7xl mx-auto relative">
        {/* Table ko onRowClick prop pass kiya */}
        <MarketTable
          data={filteredAndSortedTickers}
          onRowClick={(symbol) => setSelectedSymbol(symbol)}
        />
      </main>

      {/* Render Modal if a coin is selected */}
      {selectedSymbol && activeModalCoin && (
        <CoinModal
          coin={activeModalCoin}
          onClose={() => setSelectedSymbol(null)}
        />
      )}
    </div>
  );
}

export default App;