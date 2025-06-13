import React, { useState } from 'react';
import { TrendingUp, BarChart3, AlertTriangle, Clock, Newspaper } from 'lucide-react';

const AnalysisView: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState('NIFTY50');

  const indices = ['NIFTY50', 'BANKNIFTY', 'NIFTYIT', 'NIFTYFMCG', 'NIFTYFINANCIAL', 'NIFTYMIDCAP50', 'NIFTYSMALLCAP100'];

  const analysisData = {
    NIFTY50: {
      technicalAnalysis: {
        trend: 'Bullish',
        strength: 'Strong',
        support: '19,100',
        resistance: '19,400',
        rsi: 65,
        macd: 'Bullish Crossover',
        recommendation: 'BUY'
      },
      fundamentalAnalysis: {
        peRatio: 22.5,
        pbRatio: 3.2,
        dividendYield: 1.8,
        earningsGrowth: 12.5,
        revenueGrowth: 8.3
      },
      sectorAnalysis: [
        { sector: 'IT', weight: 18.2, performance: 2.1, impact: 'Positive' },
        { sector: 'Financial Services', weight: 35.8, performance: -0.5, impact: 'Negative' },
        { sector: 'Oil & Gas', weight: 12.4, performance: 1.8, impact: 'Positive' },
        { sector: 'Consumer Goods', weight: 8.9, performance: 0.3, impact: 'Neutral' }
      ],
      news: [
        {
          title: 'RBI Monetary Policy: Repo Rate Held at 6.50%',
          impact: 'High',
          sentiment: 'Neutral',
          time: '2 hours ago',
          relevance: 95
        },
        {
          title: 'Q3 GDP Growth Accelerates to 6.8%',
          impact: 'High',
          sentiment: 'Positive',
          time: '4 hours ago',
          relevance: 92
        }
      ]
    },
    BANKNIFTY: {
      technicalAnalysis: {
        trend: 'Sideways',
        strength: 'Moderate',
        support: '44,200',
        resistance: '45,000',
        rsi: 52,
        macd: 'Neutral',
        recommendation: 'HOLD'
      },
      fundamentalAnalysis: {
        peRatio: 15.8,
        pbRatio: 1.9,
        dividendYield: 2.4,
        earningsGrowth: 15.2,
        revenueGrowth: 11.7
      },
      sectorAnalysis: [
        { sector: 'Private Banks', weight: 65.2, performance: -0.3, impact: 'Negative' },
        { sector: 'Public Banks', weight: 25.8, performance: 0.8, impact: 'Positive' },
        { sector: 'NBFCs', weight: 9.0, performance: 1.2, impact: 'Positive' }
      ],
      news: [
        {
          title: 'Banking Sector NPAs Decline to 3.2%',
          impact: 'High',
          sentiment: 'Positive',
          time: '1 hour ago',
          relevance: 98
        },
        {
          title: 'RBI Increases Bank Credit Growth Target',
          impact: 'Medium',
          sentiment: 'Positive',
          time: '3 hours ago',
          relevance: 85
        }
      ]
    }
  };

  const currentAnalysis = analysisData[selectedIndex] || analysisData.NIFTY50;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Index Analysis</h2>
        <div className="flex items-center gap-4">
          <select 
            value={selectedIndex} 
            onChange={(e) => setSelectedIndex(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm"
          >
            {indices.map(index => (
              <option key={index} value={index}>{index}</option>
            ))}
          </select>
          <div className="text-sm text-gray-400">
            Analysis Confidence: <span className="text-secondary font-semibold">94%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Technical Analysis */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Technical Analysis
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-750 rounded-lg p-3">
                <div className="text-xs text-gray-400">Trend</div>
                <div className={`font-semibold ${
                  currentAnalysis.technicalAnalysis.trend === 'Bullish' ? 'text-secondary' :
                  currentAnalysis.technicalAnalysis.trend === 'Bearish' ? 'text-danger' : 'text-gray-300'
                }`}>
                  {currentAnalysis.technicalAnalysis.trend}
                </div>
              </div>
              <div className="bg-gray-750 rounded-lg p-3">
                <div className="text-xs text-gray-400">Strength</div>
                <div className="font-semibold">{currentAnalysis.technicalAnalysis.strength}</div>
              </div>
              <div className="bg-gray-750 rounded-lg p-3">
                <div className="text-xs text-gray-400">Support</div>
                <div className="font-semibold">{currentAnalysis.technicalAnalysis.support}</div>
              </div>
              <div className="bg-gray-750 rounded-lg p-3">
                <div className="text-xs text-gray-400">Resistance</div>
                <div className="font-semibold">{currentAnalysis.technicalAnalysis.resistance}</div>
              </div>
            </div>
            
            <div className="bg-gray-750 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">RSI</span>
                <span className="font-semibold">{currentAnalysis.technicalAnalysis.rsi}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">MACD</span>
                <span className="font-semibold">{currentAnalysis.technicalAnalysis.macd}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Recommendation</span>
                <span className={`font-semibold px-2 py-1 rounded text-xs ${
                  currentAnalysis.technicalAnalysis.recommendation === 'BUY' ? 'bg-secondary/20 text-secondary' :
                  currentAnalysis.technicalAnalysis.recommendation === 'SELL' ? 'bg-danger/20 text-danger' :
                  'bg-gray-600 text-gray-300'
                }`}>
                  {currentAnalysis.technicalAnalysis.recommendation}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Fundamental Analysis */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Fundamental Analysis
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">P/E Ratio</span>
              <span className="font-semibold">{currentAnalysis.fundamentalAnalysis.peRatio}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">P/B Ratio</span>
              <span className="font-semibold">{currentAnalysis.fundamentalAnalysis.pbRatio}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Dividend Yield</span>
              <span className="font-semibold">{currentAnalysis.fundamentalAnalysis.dividendYield}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Earnings Growth</span>
              <span className="font-semibold text-secondary">+{currentAnalysis.fundamentalAnalysis.earningsGrowth}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Revenue Growth</span>
              <span className="font-semibold text-secondary">+{currentAnalysis.fundamentalAnalysis.revenueGrowth}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sector Analysis */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-semibold mb-4">Sector Analysis</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {currentAnalysis.sectorAnalysis.map((sector, index) => (
            <div key={index} className="bg-gray-750 rounded-lg p-4 border border-gray-600">
              <h4 className="font-semibold mb-2">{sector.sector}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Weight:</span>
                  <span className="font-semibold">{sector.weight}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Performance:</span>
                  <span className={`font-semibold ${
                    sector.performance >= 0 ? 'text-secondary' : 'text-danger'
                  }`}>
                    {sector.performance >= 0 ? '+' : ''}{sector.performance}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Impact:</span>
                  <span className={`font-semibold ${
                    sector.impact === 'Positive' ? 'text-secondary' :
                    sector.impact === 'Negative' ? 'text-danger' : 'text-gray-300'
                  }`}>
                    {sector.impact}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Relevant News */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Newspaper className="w-5 h-5" />
          Relevant News for {selectedIndex}
        </h3>
        
        <div className="space-y-4">
          {currentAnalysis.news.map((item, index) => (
            <div key={index} className="bg-gray-750 rounded-lg p-4 border border-gray-600">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      item.impact === 'High' ? 'bg-danger/20 text-danger' :
                      item.impact === 'Medium' ? 'bg-accent/20 text-accent' :
                      'bg-gray-600 text-gray-300'
                    }`}>
                      {item.impact}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.sentiment === 'Positive' ? 'bg-secondary/20 text-secondary' :
                      item.sentiment === 'Negative' ? 'bg-danger/20 text-danger' :
                      'bg-gray-600 text-gray-300'
                    }`}>
                      {item.sentiment}
                    </span>
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                      {item.relevance}% relevant
                    </span>
                  </div>
                  <h4 className="font-semibold mb-1">{item.title}</h4>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    {item.time}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalysisView;