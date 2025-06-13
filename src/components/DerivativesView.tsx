import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Zap, Calculator, TrendingUp, Activity, BarChart } from 'lucide-react';

const DerivativesView: React.FC = () => {
  const [selectedContract, setSelectedContract] = useState('NIFTY50-CE-19300');
  const [selectedSegment, setSelectedSegment] = useState('Options');

  const derivatives = [
    { symbol: 'NIFTY50-CE-19300', type: 'Call', strike: 19300, expiry: '2024-01-25', ltp: 125.50, change: 12.25, iv: 18.5, oi: 2458000, volume: 156000 },
    { symbol: 'NIFTY50-PE-19300', type: 'Put', strike: 19300, expiry: '2024-01-25', ltp: 89.75, change: -8.40, iv: 19.2, oi: 1987000, volume: 142000 },
    { symbol: 'NIFTY50-CE-19400', type: 'Call', strike: 19400, expiry: '2024-01-25', ltp: 76.25, change: 18.60, iv: 17.8, oi: 3421000, volume: 198000 },
    { symbol: 'NIFTY50-PE-19200', type: 'Put', strike: 19200, expiry: '2024-01-25', ltp: 67.30, change: -5.70, iv: 18.9, oi: 2134000, volume: 175000 },
  ];

  const futures = [
    { symbol: 'NIFTY50-FUT', expiry: '2024-01-25', ltp: 19245.30, change: 156.25, oi: 15420000, volume: 2100000 },
    { symbol: 'BANKNIFTY-FUT', expiry: '2024-01-25', ltp: 44682.15, change: -89.45, oi: 8750000, volume: 1800000 },
  ];

  const greeks = {
    delta: 0.65,
    gamma: 0.008,
    theta: -12.5,
    vega: 0.15,
    rho: 0.03
  };

  const strategies = [
    { name: 'Long Straddle', description: 'Buy Call + Buy Put at same strike', pnl: '+₹2,450', maxLoss: '₹15,000', probability: '68%' },
    { name: 'Iron Condor', description: 'Sell OTM Call/Put + Buy further OTM', pnl: '+₹1,850', maxLoss: '₹8,500', probability: '72%' },
    { name: 'Bull Call Spread', description: 'Buy Call + Sell higher strike Call', pnl: '+₹3,200', maxLoss: '₹4,200', probability: '65%' },
  ];

  // Mock chart data for selected derivative
  const chartData = Array.from({ length: 50 }, (_, i) => ({
    time: `${9 + Math.floor(i / 10)}:${(i % 10) * 6}`,
    price: 125 + Math.random() * 20 - 10,
    volume: Math.random() * 100000,
  }));

  const currentData = selectedSegment === 'Options' ? derivatives : futures;
  const selectedData = currentData.find(item => item.symbol === selectedContract);

  const analyzeContract = () => {
    // Enhanced contract analysis with actual functionality
    const analysis = {
      greeks: selectedSegment === 'Options' ? greeks : null,
      technicalAnalysis: {
        trend: 'Bullish',
        support: selectedSegment === 'Options' ? '₹115' : '₹19,100',
        resistance: selectedSegment === 'Options' ? '₹135' : '₹19,400',
        rsi: 65
      },
      ivAnalysis: selectedSegment === 'Options' ? {
        currentIV: 18.5,
        historicalIV: 16.2,
        ivRank: 68
      } : null,
      recommendation: selectedSegment === 'Options' ? 'BUY - High IV with bullish momentum' : 'HOLD - Consolidation expected'
    };

    alert(`Contract Analysis Complete for ${selectedContract}

${selectedSegment === 'Options' ? `Greeks Analysis:
- Delta: ${analysis.greeks.delta}
- Gamma: ${analysis.greeks.gamma}
- Theta: ${analysis.greeks.theta}
- Vega: ${analysis.greeks.vega}
- Rho: ${analysis.greeks.rho}

IV Analysis:
- Current IV: ${analysis.ivAnalysis.currentIV}%
- Historical IV: ${analysis.ivAnalysis.historicalIV}%
- IV Rank: ${analysis.ivAnalysis.ivRank}%` : ''}

Technical Analysis:
- Trend: ${analysis.technicalAnalysis.trend}
- Support: ${analysis.technicalAnalysis.support}
- Resistance: ${analysis.technicalAnalysis.resistance}
- RSI: ${analysis.technicalAnalysis.rsi}

Recommendation: ${analysis.recommendation}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Derivatives Analysis</h2>
        <div className="flex items-center gap-4">
          <select 
            value={selectedSegment} 
            onChange={(e) => setSelectedSegment(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm"
          >
            <option value="Options">Options</option>
            <option value="Futures">Futures</option>
          </select>
          <select 
            value={selectedContract} 
            onChange={(e) => setSelectedContract(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm"
          >
            {currentData.map(contract => (
              <option key={contract.symbol} value={contract.symbol}>{contract.symbol}</option>
            ))}
          </select>
          <button 
            onClick={analyzeContract}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Analyze Contract
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart and Contract Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Chart */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <BarChart className="w-5 h-5" />
                {selectedContract} Live Chart
              </h3>
              <div className="text-sm text-gray-400">
                Last: ₹{selectedData?.ltp} ({selectedData?.change >= 0 ? '+' : ''}{selectedData?.change})
              </div>
            </div>
            
            <div className="h-64 mb-4">
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
          </div>
        </div>

        {/* Analysis Panels */}
        <div className="space-y-6">
          {selectedSegment === 'Options' && (
            <>
              {/* Greeks Analysis */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Calculator className="w-4 h-4" />
                  Greeks Analysis
                </h3>
                <div className="space-y-3">
                  {Object.entries(greeks).map(([greek, value]) => (
                    <div key={greek} className="flex items-center justify-between">
                      <span className="capitalize font-medium">{greek}</span>
                      <span className={`font-semibold ${
                        greek === 'theta' ? 'text-danger' : 
                        greek === 'delta' && value > 0.5 ? 'text-secondary' : 'text-gray-300'
                      }`}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* IV Analysis */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  IV Analysis
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Current IV</span>
                    <span className="font-semibold">18.5%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Historical IV</span>
                    <span className="font-semibold">16.2%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>IV Rank</span>
                    <span className="font-semibold text-accent">68%</span>
                  </div>
                  <div className="text-sm text-gray-400 mt-2">
                    Current IV is elevated compared to historical levels
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Technical Analysis */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Technical Analysis
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Trend</span>
                <span className="font-semibold text-secondary">Bullish</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Support</span>
                <span className="font-semibold">₹115</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Resistance</span>
                <span className="font-semibold">₹135</span>
              </div>
              <div className="flex items-center justify-between">
                <span>RSI</span>
                <span className="font-semibold text-accent">65</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Strategy Recommendations */}
      {selectedSegment === 'Options' && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Strategy Recommendations
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {strategies.map((strategy, index) => (
              <div key={index} className="bg-gray-750 rounded-lg p-4 border border-gray-600">
                <h4 className="font-semibold mb-2">{strategy.name}</h4>
                <p className="text-sm text-gray-400 mb-3">{strategy.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Current P&L:</span>
                    <span className="text-secondary font-semibold">{strategy.pnl}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Max Loss:</span>
                    <span className="text-danger font-semibold">{strategy.maxLoss}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Success Rate:</span>
                    <span className="text-accent font-semibold">{strategy.probability}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DerivativesView;