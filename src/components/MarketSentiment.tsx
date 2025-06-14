import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MarketSentimentProps {
  indexName?: string;
}

const MarketSentiment: React.FC<MarketSentimentProps> = ({ indexName = 'Market' }) => {
  const sentimentData = [
    { name: 'Bullish', value: indexName === 'NIFTY50' ? 45 : 38, color: '#10B981' },
    { name: 'Bearish', value: indexName === 'NIFTY50' ? 30 : 42, color: '#EF4444' },
    { name: 'Neutral', value: indexName === 'NIFTY50' ? 25 : 20, color: '#6B7280' },
  ];

  const signals = indexName === 'NIFTY50' ? [
    { type: 'Buy', strength: 'Strong', indicator: 'CPR + Supertrend', time: '2 min ago' },
    { type: 'Sell', strength: 'Moderate', indicator: 'RSI Divergence', time: '5 min ago' },
    { type: 'Hold', strength: 'Weak', indicator: 'VWAP Analysis', time: '8 min ago' },
  ] : [
    { type: 'Sell', strength: 'Strong', indicator: 'Banking Stress', time: '1 min ago' },
    { type: 'Hold', strength: 'Moderate', indicator: 'NPA Concerns', time: '4 min ago' },
    { type: 'Buy', strength: 'Weak', indicator: 'Credit Growth', time: '7 min ago' },
  ];

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h3 className="text-xl font-semibold mb-4">{indexName} Sentiment & Signals</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sentimentData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #4B5563',
                  borderRadius: '8px'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="space-y-3">
          {sentimentData.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm">{item.name}</span>
              </div>
              <span className="text-sm font-semibold">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-3">
        <h4 className="font-semibold text-sm text-gray-300">Recent Signals</h4>
        {signals.map((signal, index) => (
          <div key={index} className="flex items-center justify-between bg-gray-750 rounded-lg p-3">
            <div className="flex items-center gap-3">
              {signal.type === 'Buy' && <TrendingUp className="w-4 h-4 text-secondary" />}
              {signal.type === 'Sell' && <TrendingDown className="w-4 h-4 text-danger" />}
              {signal.type === 'Hold' && <Minus className="w-4 h-4 text-gray-400" />}
              
              <div>
                <div className="text-sm font-semibold">{signal.type} - {signal.strength}</div>
                <div className="text-xs text-gray-400">{signal.indicator}</div>
              </div>
            </div>
            <div className="text-xs text-gray-400">{signal.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketSentiment;