import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const IndexOverview: React.FC = () => {
  const indices = [
    { name: 'NIFTY 50', value: 19245.30, change: 156.25, changePercent: 0.82, volume: '2.1B' },
    { name: 'BANKNIFTY', value: 44682.15, change: -89.45, changePercent: -0.20, volume: '1.8B' },
    { name: 'NIFTYIT', value: 28945.80, change: 245.60, changePercent: 0.86, volume: '890M' },
    { name: 'NIFTYFMCG', value: 54231.25, change: 78.90, changePercent: 0.15, volume: '450M' },
    { name: 'NIFTYFINANCIAL', value: 19876.45, change: -45.30, changePercent: -0.23, volume: '1.2B' },
    { name: 'NIFTYMIDCAP50', value: 12456.75, change: 123.45, changePercent: 1.00, volume: '780M' },
    { name: 'NIFTYSMALLCAP100', value: 15789.30, change: 189.25, changePercent: 1.22, volume: '650M' },
  ];

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h3 className="text-xl font-semibold mb-4">Index Overview</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {indices.map((index) => (
          <div key={index.name} className="bg-gray-750 rounded-lg p-4 border border-gray-600">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-sm">{index.name}</h4>
              {index.change >= 0 ? (
                <TrendingUp className="w-4 h-4 text-secondary" />
              ) : (
                <TrendingDown className="w-4 h-4 text-danger" />
              )}
            </div>
            
            <div className="text-2xl font-bold mb-1">
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
  );
};

export default IndexOverview;