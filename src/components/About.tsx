import React from 'react';
import { AlertTriangle, ExternalLink, Github, BookOpen } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-amber-900 mb-2">Important Disclaimer</h3>
            <p className="text-amber-800 text-sm leading-relaxed">
              This project is a research and educational experiment designed to explore the capabilities of large language models (LLMs) in analyzing financial markets. 
              It is <strong>not financial advice</strong> and should not be interpreted as investment guidance or a recommendation to buy or sell any security. 
              All content is purely exploratory and for educational purposes only.
            </p>
          </div>
        </div>
      </div>

      {/* Experiment Overview */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">The ChatGPT Micro-Cap Experiment</h2>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 leading-relaxed">
            Starting with just $100, this experiment explores a simple but powerful question: 
            <strong> Can powerful large language models like ChatGPT actually generate alpha using real-time data?</strong>
          </p>
          
          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">How It Works</h3>
          <ul className="space-y-2 text-gray-600">
            <li>• ChatGPT manages a real-money portfolio of U.S. micro-cap stocks (market cap under $300M)</li>
            <li>• Daily trading updates with strict stop-loss rules</li>
            <li>• Weekly deep research sessions to reevaluate the portfolio</li>
            <li>• Complete transparency with all trades and decisions logged</li>
            <li>• Performance tracked against the S&P 500 benchmark</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Experiment Timeline</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-900">Start Date:</span>
                <p className="text-gray-600">June 27, 2025</p>
              </div>
              <div>
                <span className="font-medium text-gray-900">End Date:</span>
                <p className="text-gray-600">December 27, 2025</p>
              </div>
              <div>
                <span className="font-medium text-gray-900">Duration:</span>
                <p className="text-gray-600">6 months</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Technology Stack</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Backend</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Python with pandas for data processing</li>
              <li>• yFinance for real-time stock data</li>
              <li>• ChatGPT (OpenAI) as decision engine</li>
              <li>• CSV files for data persistence</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Frontend</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• React with TypeScript</li>
              <li>• Recharts for data visualization</li>
              <li>• Tailwind CSS for styling</li>
              <li>• Responsive design for all devices</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Links and Resources */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a
          href="https://nathanbsmith729.substack.com"
          target="_blank"
          rel="noopener noreferrer"
          className="card hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="flex items-center gap-3 mb-3">
            <BookOpen className="w-6 h-6 text-primary-600" />
            <h4 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
              Weekly Blog Updates
            </h4>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Follow the experiment's progress with detailed weekly analysis and insights.
          </p>
          <div className="flex items-center gap-1 text-primary-600 text-sm font-medium">
            <span>Read on Substack</span>
            <ExternalLink className="w-4 h-4" />
          </div>
        </a>

        <a
          href="https://github.com/LuckyOne7777/ChatGPT-Micro-Cap-Experiment"
          target="_blank"
          rel="noopener noreferrer"
          className="card hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="flex items-center gap-3 mb-3">
            <Github className="w-6 h-6 text-primary-600" />
            <h4 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
              Source Code
            </h4>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Access the complete codebase, data, and documentation on GitHub.
          </p>
          <div className="flex items-center gap-1 text-primary-600 text-sm font-medium">
            <span>View on GitHub</span>
            <ExternalLink className="w-4 h-4" />
          </div>
        </a>

        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
            <h4 className="font-semibold text-gray-900">Risk Warning</h4>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Micro-cap stocks are highly volatile and speculative. This experiment involves significant risk.
          </p>
          <p className="text-xs text-gray-500">
            Not suitable for most investors. Educational purposes only.
          </p>
        </div>
      </div>

      {/* FAQ */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-1">How does ChatGPT make trading decisions?</h4>
            <p className="text-sm text-gray-600">
              ChatGPT receives daily portfolio updates and uses deep research capabilities to analyze market conditions, 
              company fundamentals, and technical indicators to make buy/sell decisions.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Are the trades actually executed?</h4>
            <p className="text-sm text-gray-600">
              Yes, this experiment uses real money and executes actual trades in a live brokerage account. 
              All trades are logged and verified for transparency.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Can I replicate this experiment?</h4>
            <p className="text-sm text-gray-600">
              Absolutely! The complete source code and setup instructions are available on GitHub. 
              However, please understand the risks and consider using paper trading first.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};