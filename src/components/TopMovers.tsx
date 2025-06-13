import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

const TopMovers: React.FC = () => {
  const topGainers = [
    { symbol: 'ADANIPORTS', price: 1234.50, change: 89.25, changePercent: 7.82 },
    { symbol: 'TATAMOTORS', price: 567.80, change: 45.60, changePercent: 8.74 },
    { symbol: 'JSWSTEEL', price: 789.30, change: 56.40, changePercent: 7.70 },
  ];

  const topLosers = [
    { symbol: 'HDFCBANK', price: 1645.20, change: -78.50, changePercent: -4.56 },
    { symbol: 'BAJFINANCE', price: 6789.40, change: -234.80, changePercent: -3.35 },
    { symbol: 'ASIANPAINT', price: 3456.70, change: -145.30, changePercent: -4.03 },
  ];

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h3 className="text-xl font-semibold mb-4">Top Movers</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-secondary mb-3 flex items-center gap-2">
            <ArrowUp className="w-4 h-4" />
            Top Gainers
          </h4>
          <div className="space-y-3">
            {topGainers.map((stock) => (
              <div key={stock.symbol} className="bg-gray-750 rounded-lg p-3 border border-gray-600">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm">{stock.symbol}</div>
                    <div className="text-lg font-bold">₹{stock.price.toFixed(2)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-secondary font-semibold">
                      +₹{stock.change.toFixed(2)}
                    </div>
                    <div className="text-secondary text-sm">
                      +{stock.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-danger mb-3 flex items-center gap-2">
            <ArrowDown className="w-4 h-4" />
            Top Losers
          </h4>
          <div className="space-y-3">
            {topLosers.map((stock) => (
              <div key={stock.symbol} className="bg-gray-750 rounded-lg p-3 border border-gray-600">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm">{stock.symbol}</div>
                    <div className="text-lg font-bold">₹{stock.price.toFixed(2)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-danger font-semibold">
                      ₹{stock.change.toFixed(2)}
                    </div>
                    <div className="text-danger text-sm">
                      {stock.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopMovers;