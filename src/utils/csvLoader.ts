import { PortfolioEntry, TradeEntry } from '../types';
import { parseCSV } from './dataParser';

export const loadPortfolioData = async (): Promise<PortfolioEntry[]> => {
  try {
    const response = await fetch('/Scripts and CSV Files/chatgpt_portfolio_update.csv');
    if (!response.ok) {
      throw new Error('Failed to load portfolio data');
    }
    const csvText = await response.text();
    return parseCSV<PortfolioEntry>(csvText);
  } catch (error) {
    console.error('Error loading portfolio data:', error);
    return [];
  }
};

export const loadTradeData = async (): Promise<TradeEntry[]> => {
  try {
    const response = await fetch('/Scripts and CSV Files/chatgpt_trade_log.csv');
    if (!response.ok) {
      throw new Error('Failed to load trade data');
    }
    const csvText = await response.text();
    return parseCSV<TradeEntry>(csvText);
  } catch (error) {
    console.error('Error loading trade data:', error);
    return [];
  }
};