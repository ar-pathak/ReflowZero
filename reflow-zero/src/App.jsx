import { useBinanceSocket } from './hooks/useBinanceSocket';
import { MarketTable } from './features/MarketTable';

function App() {
  const tickers = useBinanceSocket(1000);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-wider text-blue-400">ReflowZero</h1>
          <p className="text-gray-400 text-sm mt-1">High-Performance WebSocket Pipeline</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-500 block">Live Streams</span>
          <span className="font-mono text-green-400 text-lg">{tickers.length} Active</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {/* Yahan hamara naya Virtualized Table render hoga */}
        <MarketTable data={tickers} />
      </main>
    </div>
  );
}

export default App;