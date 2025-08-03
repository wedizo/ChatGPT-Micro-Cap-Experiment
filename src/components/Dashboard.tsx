import React from 'react';
import { DollarSign, TrendingUp, Target, Wallet } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { PerformanceChart } from './PerformanceChart';
import { PerformanceData, PortfolioMetrics } from '../types';

interface DashboardProps {
  performanceData: PerformanceData[];
  metrics: PortfolioMetrics;
}

export const Dashboard: React.FC<DashboardProps> = ({ performanceData, metrics }) => {
  const getTrend = (value: number) => {
    if (value > 0) return 'up';
    if (value < 0) return 'down';
    return 'neutral';
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Portfolio Value"
          value={metrics.totalEquity}
          change={metrics.dayChange}
          changePercent={metrics.dayChangePercent}
          format="currency"
          icon={DollarSign}
          trend={getTrend(metrics.dayChange)}
        />
        
        <MetricCard
          title="Total Return"
          value={metrics.totalReturnPercent}
          format="percent"
          icon={TrendingUp}
          subtitle={`${metrics.totalReturn >= 0 ? '+' : ''}$${metrics.totalReturn.toFixed(2)}`}
          trend={getTrend(metrics.totalReturn)}
        />
        
        <MetricCard
          title="Alpha vs S&P 500"
          value={metrics.alpha}
          format="percent"
          icon={Target}
          subtitle={`S&P 500: ${metrics.spxReturnPercent >= 0 ? '+' : ''}${metrics.spxReturnPercent.toFixed(2)}%`}
          trend={getTrend(metrics.alpha)}
        />
        
        <MetricCard
          title="Cash Balance"
          value={metrics.cash}
          format="currency"
          icon={Wallet}
          subtitle={`Invested: $${metrics.investedValue.toFixed(2)}`}
        />
      </div>

      {/* Performance Chart */}
      <PerformanceChart data={performanceData} />

      {/* Experiment Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Experiment Overview</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Start Date:</span>
              <span className="font-medium text-gray-900">June 27, 2025</span>
            </div>
            <div className="flex justify-between">
              <span>Initial Capital:</span>
              <span className="font-medium text-gray-900">$100.00</span>
            </div>
            <div className="flex justify-between">
              <span>Strategy:</span>
              <span className="font-medium text-gray-900">AI-Driven Micro-Cap</span>
            </div>
            <div className="flex justify-between">
              <span>Trading Days:</span>
              <span className="font-medium text-gray-900">{performanceData.length - 1}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Rules</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-primary-600 mt-1">•</span>
              <span>Only U.S.-listed micro-cap stocks (under $300M market cap)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 mt-1">•</span>
              <span>Full-share positions only, no fractional shares</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 mt-1">•</span>
              <span>Strict stop-loss rules for risk management</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 mt-1">•</span>
              <span>Weekly deep research and portfolio reevaluation</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};