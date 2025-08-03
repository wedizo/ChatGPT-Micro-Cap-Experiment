import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { CurrentHolding } from '../types';
import { formatCurrency, formatPercent, getPercentageColor } from '../utils/formatters';

interface HoldingsTableProps {
  holdings: CurrentHolding[];
}

export const HoldingsTable: React.FC<HoldingsTableProps> = ({ holdings }) => {
  const getTrendIcon = (pnlPercent: number) => {
    if (pnlPercent > 0) return <TrendingUp className="w-4 h-4 text-success-600" />;
    if (pnlPercent < 0) return <TrendingDown className="w-4 h-4 text-danger-600" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="card">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Current Holdings</h2>
        <p className="text-gray-600">Active positions in the portfolio</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Ticker</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Shares</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Avg Cost</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Current Price</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Total Value</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">P&L</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Stop Loss</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((holding) => (
              <tr key={holding.ticker} className="table-row">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{holding.ticker}</span>
                    {getTrendIcon(holding.pnlPercent)}
                  </div>
                </td>
                <td className="text-right py-4 px-4 text-gray-700">
                  {holding.shares.toLocaleString()}
                </td>
                <td className="text-right py-4 px-4 text-gray-700">
                  {formatCurrency(holding.costBasis)}
                </td>
                <td className="text-right py-4 px-4 text-gray-700">
                  {formatCurrency(holding.currentPrice)}
                </td>
                <td className="text-right py-4 px-4 font-medium text-gray-900">
                  {formatCurrency(holding.totalValue)}
                </td>
                <td className="text-right py-4 px-4">
                  <div className="space-y-1">
                    <div className={`font-medium ${getPercentageColor(holding.pnl)}`}>
                      {formatCurrency(holding.pnl)}
                    </div>
                    <div className={`text-sm ${getPercentageColor(holding.pnlPercent)}`}>
                      {formatPercent(holding.pnlPercent)}
                    </div>
                  </div>
                </td>
                <td className="text-right py-4 px-4 text-gray-700">
                  {formatCurrency(holding.stopLoss)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {holdings.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No current holdings
          </div>
        )}
      </div>
    </div>
  );
};