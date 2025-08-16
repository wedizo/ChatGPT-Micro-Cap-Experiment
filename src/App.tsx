import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { HoldingsTable } from './components/HoldingsTable';
import { TradeHistory } from './components/TradeHistory';
import { Research } from './components/Research';
import { About } from './components/About';
import { loadPortfolioData, loadTradeData } from './utils/csvLoader';
import { processPerformanceData, getCurrentHoldings, calculatePortfolioMetrics } from './utils/dataParser';
import { PortfolioEntry, TradeEntry, PerformanceData, CurrentHolding, PortfolioMetrics } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [, setPortfolioData] = useState<PortfolioEntry[]>([]);
  const [tradeData, setTradeData] = useState<TradeEntry[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [currentHoldings, setCurrentHoldings] = useState<CurrentHolding[]>([]);
  const [metrics, setMetrics] = useState<PortfolioMetrics>({
    totalEquity: 100,
    totalReturn: 0,
    totalReturnPercent: 0,
    spxReturn: 0,
    spxReturnPercent: 0,
    alpha: 0,
    cash: 100,
    investedValue: 0,
    dayChange: 0,
    dayChangePercent: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [portfolio, trades] = await Promise.all([
          loadPortfolioData(),
          loadTradeData()
        ]);
        
        if (portfolio.length === 0) {
          throw new Error('No portfolio data available');
        }
        
        setPortfolioData(portfolio);
        setTradeData(trades);
        
        const performance = processPerformanceData(portfolio);
        setPerformanceData(performance);
        
        const holdings = getCurrentHoldings(portfolio);
        setCurrentHoldings(holdings);
        
        const portfolioMetrics = calculatePortfolioMetrics(portfolio, performance);
        setMetrics(portfolioMetrics);
        
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading portfolio data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Data Loading Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard performanceData={performanceData} metrics={metrics} />;
      case 'holdings':
        return <HoldingsTable holdings={currentHoldings} />;
      case 'trades':
        return <TradeHistory trades={tradeData} />;
      case 'research':
        return <Research />;
      case 'about':
        return <About />;
      default:
        return <Dashboard performanceData={performanceData} metrics={metrics} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              <p>© 2025 ChatGPT Micro-Cap Experiment. For educational purposes only.</p>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <a href="mailto:nathanbsmith.business@gmail.com" className="hover:text-gray-900 transition-colors">
                Contact
              </a>
              <span>•</span>
              <a href="https://github.com/LuckyOne7777/ChatGPT-Micro-Cap-Experiment" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;