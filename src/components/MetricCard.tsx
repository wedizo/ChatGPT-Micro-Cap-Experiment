import React from 'react';
import { LucideIcon } from 'lucide-react';
import { formatCurrency, formatPercent, getPercentageColor, getPercentageIcon } from '../utils/formatters';

interface MetricCardProps {
  title: string;
  value: number;
  change?: number;
  changePercent?: number;
  format?: 'currency' | 'percent' | 'number';
  icon?: LucideIcon;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changePercent,
  format = 'currency',
  icon: Icon,
  subtitle,
  trend
}) => {
  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return formatCurrency(val);
      case 'percent':
        return formatPercent(val);
      default:
        return val.toFixed(2);
    }
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-success-600';
    if (trend === 'down') return 'text-danger-600';
    return 'text-gray-600';
  };

  return (
    <div className="metric-card animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {Icon && <Icon className="w-4 h-4 text-gray-500" />}
            <p className="text-sm font-medium text-gray-600">{title}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">
              {formatValue(value)}
            </p>
            
            {subtitle && (
              <p className="text-xs text-gray-500">{subtitle}</p>
            )}
            
            {(change !== undefined || changePercent !== undefined) && (
              <div className="flex items-center gap-1">
                {change !== undefined && (
                  <span className={`text-sm font-medium ${getPercentageColor(change)}`}>
                    {getPercentageIcon(change)} {formatCurrency(Math.abs(change))}
                  </span>
                )}
                {changePercent !== undefined && (
                  <span className={`text-sm ${getPercentageColor(changePercent)}`}>
                    ({formatPercent(Math.abs(changePercent))})
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        
        {trend && (
          <div className={`text-2xl ${getTrendColor()}`}>
            {trend === 'up' && '📈'}
            {trend === 'down' && '📉'}
            {trend === 'neutral' && '➡️'}
          </div>
        )}
      </div>
    </div>
  );
};