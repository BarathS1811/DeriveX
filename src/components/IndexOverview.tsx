import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Search } from 'lucide-react';

const IndexOverview: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const mainIndices = [
    { 
      name: 'NIFTY 50', 
      value: 19245.30, 
      change: 156.25, 
      changePercent: 0.82, 
      volume: '2.1B',
      topGainerImpact: 15.2,
      topLoserImpact: -8.7,
      netImpact: 6.5,
      overallImpact: {
        topGainers: [
          { name: 'RELIANCE', weight: 10.8, change: 2.3, impact: 0.25 },
          { name: 'TCS', weight: 9.2, change: 1.8, impact: 0.17 },
          { name: 'INFY', weight: 7.1, change: 2.1, impact: 0.15 }
        ],
        topLosers: [
          { name: 'HDFCBANK', weight: 8.7, change: -0.5, impact: -0.04 },
          { name: 'ICICIBANK', weight: 6.8, change: -1.2, impact: -0.08 }
        ]
      }
    },
    { 
      name: 'BANKNIFTY', 
      value: 44682.15, 
      change: -89.45, 
      changePercent: -0.20, 
      volume: '1.8B',
      topGainerImpact: 12.8,
      topLoserImpact: -14.3,
      netImpact: -1.5,
      overallImpact: {
        topGainers: [
          { name: 'KOTAKBANK', weight: 12.5, change: 1.5, impact: 0.19 },
          { name: 'AXISBANK', weight: 9.8, change: 0.8, impact: 0.08 }
        ],
        topLosers: [
          { name: 'HDFCBANK', weight: 15.2, change: -1.8, impact: -0.27 },
          { name: 'ICICIBANK', weight: 13.4, change: -1.2, impact: -0.16 },
          { name: 'SBIN', weight: 11.7, change: -2.1, impact: -0.25 }
        ]
      }
    },
  ];

  const otherIndices = [
    { name: 'NIFTYIT', value: 28945.80, change: 245.60, changePercent: 0.86, volume: '890M' },
    { name: 'NIFTYFMCG', value: 54231.25, change: 78.90, changePercent: 0.15, volume: '450M' },
    { name: 'NIFTYFINANCIAL', value: 19876.45, change: -45.30, changePercent: -0.23, volume: '1.2B' },
    { name: 'NIFTYMIDCAP50', value: 12456.75, change: 123.45, changePercent: 1.00, volume: '780M' },
    { name: 'NIFTYSMALLCAP100', value: 15789.30, change: 189.25, changePercent: 1.22, volume: '650M' },
  ];

  const filteredIndices = otherIndices.filter(index => 
    index.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Index Overview</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition-colors"
          >
            <Search className="w-4 h-4" />
            Other Indices
          </button>
        </div>
      </div>
      
      {/* Main Indices - NIFTY 50 and BANKNIFTY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {mainIndices.map((index) => (
          <div key={index.name} className="bg-gray-750 rounded-lg p-6 border border-gray-600">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-lg">{index.name}</h4>
              {index.change >= 0 ? (
                <TrendingUp className="w-5 h-5 text-secondary" />
              ) : (
                <TrendingDown className="w-5 h-5 text-danger" />
              )}
            </div>
            
            <div className="text-3xl font-bold mb-2">
              {index.value.toLocaleString()}
            </div>
            
            <div className="flex items-center gap-2 text-sm mb-4">
              <span className={`flex items-center gap-1 ${
                index.change >= 0 ? 'text-secondary' : 'text-danger'
              }`}>
                {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)}
                ({index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%)
              </span>
              <span className="text-gray-400">Vol: {index.volume}</span>
            </div>

            {/* Overall Impact Analysis */}
            <div className="bg-gray-800 rounded-lg p-3 space-y-3">
              <h5 className="text-sm font-semibold text-gray-300">Overall Impact Analysis</h5>
              
              {/* Top Gainers Impact */}
              <div>
                <div className="text-xs text-gray-400 mb-1">Top Gainers Impact:</div>
                {index.overallImpact.topGainers.map((stock, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-300">{stock.name} ({stock.weight}%)</span>
                    <span className="text-secondary">+{stock.impact.toFixed(2)}%</span>
                  </div>
                ))}
              </div>

              {/* Top Losers Impact */}
              <div>
                <div className="text-xs text-gray-400 mb-1">Top Losers Impact:</div>
                {index.overallImpact.topLosers.map((stock, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-300">{stock.name} ({stock.weight}%)</span>
                    <span className="text-danger">{stock.impact.toFixed(2)}%</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs border-t border-gray-600 pt-2">
                <span className="text-gray-300 font-medium">Net Weightage Impact:</span>
                <span className={`font-semibold ${index.netImpact >= 0 ? 'text-secondary' : 'text-danger'}`}>
                  {index.netImpact >= 0 ? '+' : ''}{index.netImpact}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search for Other Indices */}
      {showSearch && (
        <div className="border-t border-gray-600 pt-4">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search indices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIndices.map((index) => (
              <div key={index.name} className="bg-gray-750 rounded-lg p-4 border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm">{index.name}</h4>
                  {index.change >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-secondary" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-danger" />
                  )}
                </div>
                
                <div className="text-xl font-bold mb-1">
                  {index.value.toLocaleString()}
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <span className={`flex items-center gap-1 ${
                    index.change >= 0 ? 'text-secondary' : 'text-danger'
                  }`}>
                    {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)}
                    ({index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%)
                  </span>
                </div>
                
                <div className="text-xs text-gray-400 mt-2">
                  Vol: {index.volume}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IndexOverview;