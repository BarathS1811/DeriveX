import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Settings, TrendingUp, BarChart } from 'lucide-react';

const ChartsView: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState('NIFTY50');
  const [selectedIndicators, setSelectedIndicators] = useState(['CPR', 'Supertrend']);

  const indicatorCombos = [
    { name: 'CPR + Supertrend', type: 'Intraday', indicators: ['CPR', 'Supertrend'] },
    { name: 'VWAP + RSI', type: 'Scalping', indicators: ['VWAP', 'RSI'] },
    { name: 'EMA 20/200 + MACD', type: 'Swing', indicators: ['EMA20', 'EMA200', 'MACD'] },
    { name: 'OI + Supertrend', type: 'Options', indicators: ['OI', 'Supertrend'] },
    { name: 'PA + Volume + ST', type: 'Breakouts', indicators: ['PA', 'Volume', 'Supertrend'] },
    { name: 'CPR + VWAP + ST', type: 'Triple Confirmation', indicators: ['CPR', 'VWAP', 'Supertrend'] },
    { name: 'Heikin Ashi + ST', type: 'Clean Trend', indicators: ['HeikinAshi', 'Supertrend'] },
    { name: 'Bollinger + RSI Div', type: 'Reversals', indicators: ['BollingerBands', 'RSI'] },
    { name: 'Market Structure + CPR + OI', type: 'Macro View', indicators: ['MarketStructure', 'CPR', 'OI'] },
  ];

  const indices = ['NIFTY50', 'BANKNIFTY', 'NIFTYIT', 'NIFTYFMCG', 'NIFTYFINANCIAL', 'NIFTYMIDCAP50', 'NIFTYSMALLCAP100'];

  // Mock chart data
  const chartData = Array.from({ length: 50 }, (_, i) => ({
    time: `${9 + Math.floor(i / 10)}:${(i % 10) * 6}`,
    price: 19000 + Math.random() * 500 - 250,
    volume: Math.random() * 1000000,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Live Charts</h2>
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
          <button className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors">
            <Settings className="w-4 h-4" />
            Chart Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <BarChart className="w-4 h-4" />
            Indicator Combos
          </h3>
          <div className="space-y-2">
            {indicatorCombos.map((combo, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndicators(combo.indicators)}
                className="w-full text-left p-3 rounded-lg bg-gray-750 hover:bg-gray-700 transition-colors border border-gray-600"
              >
                <div className="font-semibold text-sm">{combo.name}</div>
                <div className="text-xs text-gray-400">{combo.type}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-semibold">{selectedIndex}</h3>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-secondary" />
                <span className="text-secondary">19,245.30 (+0.82%)</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              Active: {selectedIndicators.join(', ')}
            </div>
          </div>

          <div className="h-96 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #4B5563',
                    borderRadius: '8px'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#0EA5E9" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-750 rounded-lg p-3">
              <div className="text-xs text-gray-400">Open</div>
              <div className="font-semibold">19,089.05</div>
            </div>
            <div className="bg-gray-750 rounded-lg p-3">
              <div className="text-xs text-gray-400">High</div>
              <div className="font-semibold text-secondary">19,297.85</div>
            </div>
            <div className="bg-gray-750 rounded-lg p-3">
              <div className="text-xs text-gray-400">Low</div>
              <div className="font-semibold text-danger">19,045.20</div>
            </div>
            <div className="bg-gray-750 rounded-lg p-3">
              <div className="text-xs text-gray-400">Volume</div>
              <div className="font-semibold">2.1B</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartsView;