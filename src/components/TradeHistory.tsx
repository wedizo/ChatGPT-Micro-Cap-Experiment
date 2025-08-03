import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Calendar, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { Trade } from '../types';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface TradeHistoryProps {
  trades: Trade[];
  loading?: boolean;
}

const TradeRow: React.FC<{ trade: Trade }> = ({ trade }) => {
  const isBuy = trade.sharesBought > 0;
  const isProfit = trade.pnl > 0;
  
  return (
    <tr className="hover:bg-gray-50 transition-colors duration-200">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${isBuy ? 'bg-green-50' : 'bg-red-50'}`}>
            {isBuy ? (
              <ArrowUpRight className={`w-4 h-4 ${isBuy ? 'text-green-600' : 'text-red-600'}`} />
            ) : (
              <ArrowDownLeft className={`w-4 h-4 text-red-600`} />
            )}
          </div>
          <div>
            <div className="font-semibold text-gray-900">{trade.ticker}</div>
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {trade.date}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
          isBuy ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {isBuy ? 'BUY' : 'SELL'}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {isBuy ? trade.sharesBought : trade.sharesSold}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formatCurrency(isBuy ? trade.buyPrice : trade.sellPrice)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span className={`font-semibold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(trade.pnl)}
          </span>
          {!isBuy && (
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
              isProfit ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {isProfit ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-600 max-w-xs">
          {trade.reason}
        </div>
      </td>
    </tr>
  );
};

const LoadingSkeleton: React.FC = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        <div>
          <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-6 bg-gray-200 rounded w-12"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-200 rounded w-8"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-200 rounded w-16"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-200 rounded w-16"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-32"></div>
    </td>
  </tr>
);

export const TradeHistory: React.FC<TradeHistoryProps> = ({ trades, loading = false }) => {
  const totalTrades = trades.length;
  const totalPnL = trades.reduce((sum, trade) => sum + trade.pnl, 0);
  const winningTrades = trades.filter(trade => trade.pnl > 0).length;
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Trade History</h2>
          <p className="text-sm text-gray-500 mt-1">
            {totalTrades} trade{totalTrades !== 1 ? 's' : ''} • Win Rate: {winRate.toFixed(1)}%
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-gray-500">Total P&L</div>
            <div className={`font-bold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalPnL)}
            </div>
          </div>
          <DollarSign className="w-8 h-8 text-gray-400" />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Stock & Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Action
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Shares
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                P&L
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Reason
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <LoadingSkeleton key={index} />
              ))
            ) : trades.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="text-gray-400 mb-2">📈</div>
                  <p className="text-gray-500">No trades found</p>
                </td>
              </tr>
            ) : (
              trades.map((trade, index) => (
                <TradeRow key={`${trade.ticker}-${trade.date}-${index}`} trade={trade} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};