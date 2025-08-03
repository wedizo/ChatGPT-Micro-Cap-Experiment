import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, DollarSign } from 'lucide-react';
import { Holding } from '../types';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface HoldingsTableProps {
  holdings: Holding[];
  loading?: boolean;
}

const HoldingRow: React.FC<{ holding: Holding }> = ({ holding }) => {
  const pnlPercentage = ((holding.currentPrice - holding.costBasis) / holding.costBasis) * 100;
  const isPositive = holding.pnl >= 0;
  const isNearStopLoss = holding.currentPrice <= holding.stopLoss * 1.05; // Within 5% of stop loss
  
  return (
    <tr className="hover:bg-gray-50 transition-colors duration-200">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="font-semibold text-gray-900">{holding.ticker}</div>
          {isNearStopLoss && (
            <AlertTriangle className="w-4 h-4 text-amber-500 ml-2" title="Near stop loss" />
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {holding.shares}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formatCurrency(holding.costBasis)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formatCurrency(holding.currentPrice)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formatCurrency(holding.stopLoss)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formatCurrency(holding.totalValue)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(holding.pnl)}
          </span>
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {formatPercentage(pnlPercentage / 100)}
          </div>
        </div>
      </td>
    </tr>
  );
};

const LoadingSkeleton: React.FC = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-200 rounded w-16"></div>
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
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-200 rounded w-16"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-200 rounded w-16"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-200 rounded w-20"></div>
    </td>
  </tr>
);

export const HoldingsTable: React.FC<HoldingsTableProps> = ({ holdings, loading = false }) => {
  const totalValue = holdings.reduce((sum, holding) => sum + holding.totalValue, 0);
  const totalPnL = holdings.reduce((sum, holding) => sum + holding.pnl, 0);
  const totalCost = holdings.reduce((sum, holding) => sum + (holding.costBasis * holding.shares), 0);
  const totalPnLPercentage = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Current Holdings</h2>
          <p className="text-sm text-gray-500 mt-1">
            {holdings.length} position{holdings.length !== 1 ? 's' : ''} • Total Value: {formatCurrency(totalValue)}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-gray-500">Total P&L</div>
            <div className={`font-bold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalPnL)} ({formatPercentage(totalPnLPercentage / 100)})
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
                Ticker
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Shares
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Avg Cost
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Current Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Stop Loss
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Total Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                P&L
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <LoadingSkeleton key={index} />
              ))
            ) : holdings.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="text-gray-400 mb-2">📊</div>
                  <p className="text-gray-500">No holdings found</p>
                </td>
              </tr>
            ) : (
              holdings.map((holding, index) => (
                <HoldingRow key={`${holding.ticker}-${index}`} holding={holding} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};