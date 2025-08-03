import React, { useState } from 'react';
import { Search, TrendingUp, AlertTriangle, Target, Clock, Brain, FileText, Zap } from 'lucide-react';
import { ResearchRequest, ResearchResult } from '../types';
import { generateResearch } from '../api/research';

export const Research: React.FC = () => {
  const [ticker, setTicker] = useState('');
  const [analysisType, setAnalysisType] = useState<'fundamental' | 'technical' | 'comprehensive'>('comprehensive');
  const [timeframe, setTimeframe] = useState<'1month' | '3months' | '6months' | '1year'>('3months');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ResearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleResearch = async () => {
    if (!ticker.trim()) {
      setError('Please enter a stock ticker');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const request: ResearchRequest = {
        ticker: ticker.toUpperCase(),
        analysisType,
        timeframe,
      };




      // Make real API call to backend
      const result = await generateResearch(request);

      setResults(prev => [result, ...prev]);
      setTicker('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate research. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'buy': return 'text-success-600 bg-success-100';
      case 'sell': return 'text-danger-600 bg-danger-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-success-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-danger-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Research Lab</h1>
            <p className="text-gray-600">ChatGPT-powered micro-cap stock analysis</p>
          </div>
        </div>
      </div>

      {/* Research Form */}
      <div className="card max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Search className="w-5 h-5" />
          Request Stock Analysis
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Ticker
            </label>
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              placeholder="Enter ticker (e.g., ABEO, IINN)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Analysis Type
              </label>
              <select
                value={analysisType}
                onChange={(e) => setAnalysisType(e.target.value as any)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                disabled={isLoading}
              >
                <option value="comprehensive">Comprehensive Analysis</option>
                <option value="fundamental">Fundamental Only</option>
                <option value="technical">Technical Only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Horizon
              </label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value as any)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                disabled={isLoading}
              >
                <option value="1month">1 Month</option>
                <option value="3months">3 Months</option>
                <option value="6months">6 Months</option>
                <option value="1year">1 Year</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleResearch}
            disabled={isLoading || !ticker.trim()}
            className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Generate AI Analysis
              </>
            )}
          </button>

          {error && (
            <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-danger-800">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Research Results */}
      {results.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Research Results
          </h2>

          {results.map((result) => (
            <div key={result.id} className="card animate-slide-up">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-gray-900">{result.ticker}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRecommendationColor(result.recommendation)}`}>
                      {result.recommendation.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(result.timestamp).toLocaleDateString()}
                    </span>
                    <span>Analysis: {result.analysisType}</span>
                    <span>Timeframe: {result.timeframe}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 mb-1">Confidence</div>
                  <div className={`text-2xl font-bold ${getConfidenceColor(result.confidence)}`}>
                    {result.confidence}%
                  </div>
                </div>
              </div>

              {/* Analysis */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">AI Analysis</h4>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed">{result.analysis}</p>
                </div>
              </div>

              {/* Key Metrics */}
              {(result.targetPrice || result.stopLoss) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {result.targetPrice && (
                    <div className="bg-success-50 border border-success-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-5 h-5 text-success-600" />
                        <span className="font-medium text-success-800">Target Price</span>
                      </div>
                      <div className="text-2xl font-bold text-success-900">
                        ${result.targetPrice.toFixed(2)}
                      </div>
                    </div>
                  )}
                  {result.stopLoss && (
                    <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-danger-600" />
                        <span className="font-medium text-danger-800">Stop Loss</span>
                      </div>
                      <div className="text-2xl font-bold text-danger-900">
                        ${result.stopLoss.toFixed(2)}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Key Points, Risks, Catalysts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-success-600" />
                    Key Strengths
                  </h5>
                  <ul className="space-y-2">
                    {result.keyPoints.map((point, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-success-500 rounded-full mt-2 flex-shrink-0"></span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-danger-600" />
                    Risk Factors
                  </h5>
                  <ul className="space-y-2">
                    {result.risks.map((risk, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-danger-500 rounded-full mt-2 flex-shrink-0"></span>
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary-600" />
                    Catalysts
                  </h5>
                  <ul className="space-y-2">
                    {result.catalysts.map((catalyst, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
                        {catalyst}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-amber-900 mb-2">Research Disclaimer</h3>
            <p className="text-amber-800 text-sm leading-relaxed">
              This AI-generated research is for educational and experimental purposes only. It should not be considered as financial advice or a recommendation to buy, sell, or hold any security. Always conduct your own research and consult with qualified financial professionals before making investment decisions. Micro-cap stocks carry significant risks including high volatility and limited liquidity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};