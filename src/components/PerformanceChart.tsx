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
} from 'recharts';
import { PerformanceData } from '../types';
import { formatCurrency, formatDateShort } from '../utils/formatters';

interface PerformanceChartProps {
  data: PerformanceData[];
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{formatDateShort(label)}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-600">{entry.name}:</span>
              <span className="text-sm font-medium text-gray-900">
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Portfolio Performance</h2>
        <p className="text-gray-600">ChatGPT Portfolio vs S&P 500 ($100 invested)</p>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDateShort}
              stroke="#64748b"
              fontSize={12}
            />
            <YAxis
              tickFormatter={(value) => `$${value}`}
              stroke="#64748b"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="portfolioValue"
              stroke="#0ea5e9"
              strokeWidth={3}
              dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#0ea5e9', strokeWidth: 2 }}
              name="ChatGPT Portfolio"
            />
            <Line
              type="monotone"
              dataKey="spxValue"
              stroke="#f97316"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#f97316', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, stroke: '#f97316', strokeWidth: 2 }}
              name="S&P 500"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};