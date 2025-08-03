import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart
} from 'recharts';
import { PortfolioData } from '../types';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface PerformanceChartProps {
  data: PortfolioData[];
  loading?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const chatgptValue = payload.find((p: any) => p.dataKey === 'totalEquity')?.value;
    const sp500Value = payload.find((p: any) => p.dataKey === 'sp500Value')?.value;
    
    return (
      <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        {chatgptValue && (
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">ChatGPT Portfolio:</span>
            <span className="font-semibold text-blue-600">{formatCurrency(chatgptValue)}</span>
            <span className="text-xs text-gray-500">
              ({formatPercentage((chatgptValue - 100) / 100)})
            </span>
          </div>
        )}
        {sp500Value && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-sm text-gray-600">S&P 500:</span>
            <span className="font-semibold text-orange-600">{formatCurrency(sp500Value)}</span>
            <span className="text-xs text-gray-500">
              ({formatPercentage((sp500Value - 100) / 100)})
            </span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ data, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-80 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">📊</div>
          <p className="text-gray-500">No performance data available</p>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => Math.max(d.totalEquity, d.sp500Value || 0)));
  const minValue = Math.min(...data.map(d => Math.min(d.totalEquity, d.sp500Value || 0)));
  const padding = (maxValue - minValue) * 0.1;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Portfolio Performance</h2>
          <p className="text-sm text-gray-500 mt-1">ChatGPT vs S&P 500 ($100 invested)</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">ChatGPT</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-gray-600">S&P 500</span>
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={450}>
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <defs>
            <linearGradient id="chatgptGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12, fill: '#64748b' }}
            axisLine={{ stroke: '#e2e8f0' }}
          />
          <YAxis 
            domain={[minValue - padding, maxValue + padding]}
            tick={{ fontSize: 12, fill: '#64748b' }}
            axisLine={{ stroke: '#e2e8f0' }}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
          />
          <Tooltip content={<CustomTooltip />} />
          
          <ReferenceLine y={100} stroke="#94a3b8" strokeDasharray="2 2" />
          
          <Area
            type="monotone"
            dataKey="totalEquity"
            stroke="#3b82f6"
            fill="url(#chatgptGradient)"
            strokeWidth={0}
          />
          
          <Line 
            type="monotone" 
            dataKey="totalEquity" 
            stroke="#3b82f6" 
            strokeWidth={3}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#ffffff' }}
            name="ChatGPT Portfolio"
          />
          <Line 
            type="monotone" 
            dataKey="sp500Value" 
            stroke="#f97316" 
            strokeWidth={2}
            strokeDasharray="8 4"
            dot={{ fill: '#f97316', strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5, stroke: '#f97316', strokeWidth: 2, fill: '#ffffff' }}
            name="S&P 500"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};