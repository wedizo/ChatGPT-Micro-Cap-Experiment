import Papa from 'papaparse';
import { PortfolioEntry, TradeEntry, PerformanceData, CurrentHolding, PortfolioMetrics } from '../types';

export const parseCSV = <T>(csvText: string): T[] => {
  const result = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  });
  
  return result.data as T[];
};

export const calculateSPXValue = (date: string): number => {
  // S&P 500 baseline from June 27, 2025: 6173.07
  const baselinePrice = 6173.07;
  const scalingFactor = 100 / baselinePrice;
  
  // Mock S&P 500 data - in a real implementation, this would fetch from an API
  const mockSPXPrices: Record<string, number> = {
    '2025-06-27': 6173.07,
    '2025-06-30': 6180.25,
    '2025-07-01': 6175.50,
    '2025-07-02': 6190.75,
    '2025-07-03': 6195.30,
    '2025-07-07': 6185.60,
    '2025-07-08': 6200.45,
    '2025-07-09': 6210.80,
    '2025-07-10': 6205.25,
    '2025-07-11': 6198.70,
    '2025-07-14': 6215.90,
    '2025-07-15': 6220.35,
    '2025-07-16': 6235.60,
    '2025-07-17': 6245.80,
    '2025-07-18': 6240.25,
    '2025-07-21': 6250.70,
    '2025-07-22': 6255.40,
    '2025-07-23': 6260.85,
    '2025-07-24': 6265.20,
    '2025-07-25': 6270.45,
    '2025-07-28': 6275.80,
    '2025-07-29': 6280.15,
    '2025-07-30': 6285.50,
    '2025-07-31': 6290.85,
    '2025-08-01': 6295.20,
  };
  
  const price = mockSPXPrices[date] || baselinePrice;
  return price * scalingFactor;
};

export const processPerformanceData = (portfolioData: PortfolioEntry[]): PerformanceData[] => {
  const totalEntries = portfolioData.filter(entry => entry.Ticker === 'TOTAL');
  
  // Add baseline entry
  const baselineEntry: PerformanceData = {
    date: '2025-06-27',
    portfolioValue: 100,
    spxValue: 100,
    dailyReturn: 0,
  };
  
  const performanceData = totalEntries.map((entry, index) => {
    const portfolioValue = Number(entry['Total Equity']) || 0;
    const spxValue = calculateSPXValue(entry.Date);
    
    let dailyReturn = 0;
    if (index > 0) {
      const prevValue = Number(totalEntries[index - 1]['Total Equity']) || 100;
      dailyReturn = ((portfolioValue - prevValue) / prevValue) * 100;
    }
    
    return {
      date: entry.Date,
      portfolioValue,
      spxValue,
      dailyReturn,
    };
  });
  
  return [baselineEntry, ...performanceData];
};

export const getCurrentHoldings = (portfolioData: PortfolioEntry[]): CurrentHolding[] => {
  const latestDate = portfolioData
    .filter(entry => entry.Ticker !== 'TOTAL')
    .reduce((latest, entry) => {
      return new Date(entry.Date) > new Date(latest) ? entry.Date : latest;
    }, '2025-01-01');
  
  const latestEntries = portfolioData.filter(
    entry => entry.Date === latestDate && entry.Ticker !== 'TOTAL'
  );
  
  return latestEntries.map(entry => {
    const shares = Number(entry.Shares) || 0;
    const costBasis = Number(entry['Cost Basis']) || 0;
    const currentPrice = Number(entry['Current Price']) || 0;
    const totalValue = Number(entry['Total Value']) || 0;
    const pnl = Number(entry.PnL) || 0;
    const stopLoss = Number(entry['Stop Loss']) || 0;
    
    return {
      ticker: entry.Ticker,
      shares,
      costBasis: costBasis / shares,
      currentPrice,
      totalValue,
      pnl,
      pnlPercent: costBasis > 0 ? (pnl / costBasis) * 100 : 0,
      stopLoss,
    };
  });
};

export const calculatePortfolioMetrics = (
  portfolioData: PortfolioEntry[],
  performanceData: PerformanceData[]
): PortfolioMetrics => {
  const latestTotal = portfolioData
    .filter(entry => entry.Ticker === 'TOTAL')
    .slice(-1)[0];
  
  if (!latestTotal) {
    return {
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
    };
  }
  
  const totalEquity = Number(latestTotal['Total Equity']) || 100;
  const cash = Number(latestTotal['Cash Balance']) || 0;
  const investedValue = totalEquity - cash;
  
  const totalReturn = totalEquity - 100;
  const totalReturnPercent = ((totalEquity - 100) / 100) * 100;
  
  const latestSPX = performanceData[performanceData.length - 1]?.spxValue || 100;
  const spxReturn = latestSPX - 100;
  const spxReturnPercent = ((latestSPX - 100) / 100) * 100;
  
  const alpha = totalReturnPercent - spxReturnPercent;
  
  // Calculate day change
  let dayChange = 0;
  let dayChangePercent = 0;
  
  if (performanceData.length >= 2) {
    const today = performanceData[performanceData.length - 1];
    const yesterday = performanceData[performanceData.length - 2];
    dayChange = today.portfolioValue - yesterday.portfolioValue;
    dayChangePercent = ((today.portfolioValue - yesterday.portfolioValue) / yesterday.portfolioValue) * 100;
  }
  
  return {
    totalEquity,
    totalReturn,
    totalReturnPercent,
    spxReturn,
    spxReturnPercent,
    alpha,
    cash,
    investedValue,
    dayChange,
    dayChangePercent,
  };
};