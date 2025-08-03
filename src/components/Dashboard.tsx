import React from 'react';
import { TrendingUp, DollarSign, Target, Calendar } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { PerformanceChart } from './PerformanceChart';
import { PortfolioData } from '../types';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface DashboardProps {
  portfolioData: PortfolioData[];
  loading?: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ portfolioData, loading = false }) => {
  if (!portfolioData || portfolioData.length === 0) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="text-center py-12">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-500">Loading portfolio data...</p>
        </div>
      </div>
    );
  }

  const latestData = portfolioData[portfolioData.length - 1];
  const firstData = portfolioData[0];
  const totalReturn = ((latestData.totalEquity - 100) / 100) * 100;
  const sp500Return = latestData.sp500Value ? ((latestData.sp500Value - 100) / 100) * 100 : 0;
  const alpha = totalReturn - sp500Return;
  
  // Calculate daily change
  const previousData = portfolioData.length > 1 ? portfolioData[portfolioData.length - 2] : latestData;
  const dailyChange = latestData.totalEquity - previousData.totalEquity;
  const dailyChangePercent = ((dailyChange / previousData.totalEquity) * 100);
  
  // Calculate max drawdown
  let maxEquity = 100;
  let maxDrawdown = 0;
  portfolioData.forEach(data => {
    if (data.totalEquity > maxEquity) {
      maxEquity = data.totalEquity;
    }
    const drawdown = ((maxEquity - data.totalEquity) / maxEquity) * 100;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  });
  
  // Trading days
  const tradingDays = portfolioData.length;
  const startDate = new Date(firstData.date);
  const endDate = new Date(latestData.date);
  const daysDiff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="bg-gradient-primary rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Portfolio Performance</h1>
            <p className="text-blue-100 text-lg">
              ChatGPT vs S&P 500 • {tradingDays} trading days
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold mb-1">{formatCurrency(latestData.totalEquity)}</div>
            <div className="text-blue-100">Current Value</div>
          </div>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Return"
          value={formatPercentage(totalReturn / 100)}
          change={`${formatCurrency(latestData.totalEquity - 100)} gain`}
          changeType={totalReturn >= 0 ? 'positive' : 'negative'}
          icon={<TrendingUp className="w-5 h-5" />}
          subtitle="vs $100 invested"
          loading={loading}
        />
        <MetricCard
          title="Alpha vs S&P 500"
          value={formatPercentage(alpha / 100)}
          change={`${alpha >= 0 ? 'Outperforming' : 'Underperforming'} by ${Math.abs(alpha).toFixed(1)}%`}
          changeType={alpha >= 0 ? 'positive' : 'negative'}
          icon={<Target className="w-5 h-5" />}
          subtitle="Excess return"
          loading={loading}
        />
        <MetricCard
          title="Cash Balance"
          value={formatCurrency(latestData.cash)}
          subtitle="Available for trading"
          icon={<DollarSign className="w-5 h-5" />}
          loading={loading}
        />
        <MetricCard
          title="Daily Change"
          value={formatCurrency(dailyChange)}
          change={`${formatPercentage(dailyChangePercent / 100)}`}
          changeType={dailyChange >= 0 ? 'positive' : 'negative'}
          icon={<Calendar className="w-5 h-5" />}
          subtitle="Since yesterday"
          loading={loading}
        />
      </div>
      
      {/* Performance Chart */}
      <PerformanceChart data={portfolioData} loading={loading} />
      
      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Risk Metrics</h3>
            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-red-600" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Max Drawdown</span>
              <span className="font-semibold text-red-600">-{maxDrawdown.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Volatility</span>
              <span className="font-semibold text-gray-900">High</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Time Period</h3>
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Start Date</span>
              <span className="font-semibold text-gray-900">{firstData.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Days Active</span>
              <span className="font-semibold text-gray-900">{daysDiff}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Strategy</h3>
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Focus</span>
              <span className="font-semibold text-gray-900">Micro-Cap</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">AI Model</span>
              <span className="font-semibold text-gray-900">ChatGPT-4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};