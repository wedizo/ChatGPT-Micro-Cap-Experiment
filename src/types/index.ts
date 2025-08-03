export interface PortfolioEntry {
  Date: string;
  Ticker: string;
  Shares: number | string;
  'Cost Basis': number | string;
  'Stop Loss': number | string;
  'Current Price': number | string;
  'Total Value': number | string;
  PnL: number | string;
  Action: string;
  'Cash Balance': number | string;
  'Total Equity': number | string;
}

export interface TradeEntry {
  Date: string;
  Ticker: string;
  'Shares Bought': number | string;
  'Buy Price': number | string;
  'Cost Basis': number | string;
  PnL: number | string;
  Reason: string;
  'Shares Sold': number | string;
  'Sell Price': number | string;
}

export interface PerformanceData {
  date: string;
  portfolioValue: number;
  spxValue: number;
  dailyReturn: number;
}

export interface CurrentHolding {
  ticker: string;
  shares: number;
  costBasis: number;
  currentPrice: number;
  totalValue: number;
  pnl: number;
  pnlPercent: number;
  stopLoss: number;
}

export interface PortfolioMetrics {
  totalEquity: number;
  totalReturn: number;
  totalReturnPercent: number;
  spxReturn: number;
  spxReturnPercent: number;
  alpha: number;
  cash: number;
  investedValue: number;
  dayChange: number;
  dayChangePercent: number;
}