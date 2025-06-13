import React, { useState } from 'react';
import { Zap, Calculator, TrendingUp, Activity } from 'lucide-react';

const DerivativesView: React.FC = () => {
  const [selectedContract, setSelectedContract] = useState('NIFTY50-CE-19300');

  const derivatives = [
    { symbol: 'NIFTY50-CE-19300', type: 'Call', strike: 19300, expiry: '2024-01-25', ltp: 125.50, change: 12.25, iv: 18.5, oi: 2458000, volume: 156000 },
    { symbol: 'NIFTY50-PE-19300', type: 'Put', strike: 19300, expiry: '2024-01-25', ltp: 89.75, change: -8.40, iv: 19.2, oi: 1987000, volume: 142000 },
    { symbol: 'NIFTY50-CE-19400', type: 'Call', strike: 19400, expiry: '2024-01-25', ltp: 76.25, change: 18.60, iv: 17.8, oi: 3421000, volume: 198000 },
    { symbol: 'NIFTY50-PE-19200', type: 'Put', strike: 19200, expiry: '2024-01-25', ltp: 67.30, change: -5.70, iv: 18.9, oi: 2134000, volume: 175000 },
  ];

  const greeks = {
    delta: 0.65,
    gamma: 0.008,
    theta: -12.5,
    vega: 0.15,
    rho: 0.03
  };

  const strategies = [
    { name: 'Long Straddle', description: 'Buy Call + Buy Put at same strike', pnl: '+₹2,450', maxLoss: '₹15,000' },
    { name: 'Iron Condor', description: 'Sell OTM Call/Put + Buy further OTM', pnl: '+₹1,850', maxLoss: '₹8,500' },
    { name: 'Bull Call Spread', description: 'Buy Call + Sell higher strike Call', pnl: '+₹3,200', maxLoss: '₹4,200' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Derivatives Analysis</h2>
        <div className="flex items-center gap-4">
          <select 
            value={selectedContract} 
            onChange={(e) => setSelectedContract(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm"
          >
            {derivatives.map(contract => (
              <option key={contract.symbol} value={contract.symbol}>{contract.symbol}</option>
            ))}
          </select>
          <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            Analyze Contract
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Options Chain
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-600">
                <tr className="text-left">
                  <th className="pb-2">Contract</th>
                  <th className="pb-2">Type</th>
                  <th className="pb-2">LTP</th>
                  <th className="pb-2">Change</th>
                  <th className="pb-2">IV</th>
                  <th className="pb-2">OI</th>
                  <th className="pb-2">Volume</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                {derivatives.map((contract, index) => (
                  <tr key={index} className={`border-b border-gray-700 hover:bg-gray-750 ${selectedContract === contract.symbol ? 'bg-primary/10' : ''}`}>
                    <td className="py-3 font-semibold">{contract.symbol}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        contract.type === 'Call' ? 'bg-secondary/20 text-secondary' : 'bg-danger/20 text-danger'
                      }`}>
                        {contract.type}
                      </span>
                    </td>
                    <td className="py-3 font-semibold">₹{contract.ltp}</td>
                    <td className={`py-3 ${contract.change >= 0 ? 'text-secondary' : 'text-danger'}`}>
                      {contract.change >= 0 ? '+' : ''}₹{contract.change}
                    </td>
                    <td className="py-3">{contract.iv}%</td>
                    <td className="py-3">{(contract.oi / 1000000).toFixed(1)}M</td>
                    <td className="py-3">{(contract.volume / 1000).toFixed(0)}K</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
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
        </div>
      </div>

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
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="text-gray-400">Current P&L: </span>
                  <span className="text-secondary font-semibold">{strategy.pnl}</span>
                </div>
                <div>
                  <span className="text-gray-400">Max Loss: </span>
                  <span className="text-danger font-semibold">{strategy.maxLoss}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DerivativesView;