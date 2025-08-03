import React from 'react';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { TradeEntry } from '../types';
import { formatCurrency, formatDate, getPercentageColor } from '../utils/formatters';

interface TradeHistoryProps {
  trades: TradeEntry[];
}

export const TradeHistory: React.FC<TradeHistoryProps> = ({ trades }) => {
  const getTradeType = (trade: TradeEntry): 'buy' | 'sell' => {
    return trade['Shares Bought'] && Number(trade['Shares Bought']) > 0 ? 'buy' : 'sell';
  };

  const getTradeIcon = (type: 'buy' | 'sell') => {
    return type === 'buy' 
      ? <ArrowUpRight className="w-4 h-4 text-success-600" />
      : <ArrowDownLeft className="w-4 h-4 text-danger-600" />;
  };

  const sortedTrades = [...trades].sort((a, b) => 
    new Date(b.Date).getTime() - new Date(a.Date).getTime()
  );

  return (
    <div className="card">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Trade History</h2>
        <p className="text-gray-600">Recent trading activity and decisions</p>
      </div>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {sortedTrades.map((trade, index) => {
          const tradeType = getTradeType(trade);
          const pnl = Number(trade.PnL) || 0;
          
          return (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getTradeIcon(tradeType)}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{trade.Ticker}</span>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        tradeType === 'buy' 
                          ? 'bg-success-100 text-success-700' 
                          : 'bg-danger-100 text-danger-700'
                      }`}>
                        {tradeType.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{formatDate(trade.Date)}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-medium text-gray-900">
                    {tradeType === 'buy' 
                      ? `${trade['Shares Bought']} shares @ ${formatCurrency(Number(trade['Buy Price']))}`
                      : `${trade['Shares Sold']} shares @ ${formatCurrency(Number(trade['Sell Price']))}`
                    }
                  </div>
                  {pnl !== 0 && (
                    <div className={`text-sm font-medium ${getPercentageColor(pnl)}`}>
                      P&L: {formatCurrency(pnl)}
                    </div>
                  )}
                </div>
              </div>
              
              {trade.Reason && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Reason:</span> {trade.Reason}
                  </p>
                </div>
              )}
            </div>
          );
        })}
        
        {sortedTrades.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No trades recorded yet
          </div>
        )}
      </div>
    </div>
  );
};