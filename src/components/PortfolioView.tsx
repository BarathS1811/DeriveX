import React, { useState, useEffect } from 'react';
import { Briefcase, TrendingUp, TrendingDown, PieChart, BarChart3, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { tradingService, Position } from '../services/TradingService';
import { authService } from '../services/AuthService';

const PortfolioView: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('1M');
  const [user, setUser] = useState(authService.getCurrentUser());
  const [positions, setPositions] = useState<Position[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setUser(authService.getCurrentUser());
      if (authService.isLoggedIn()) {
        setPositions(tradingService.getPositions());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const holdings = [
    {
      symbol: 'RELIANCE',
      quantity: 50,
      avgPrice: 2400.00,
      ltp: 2456.75,
      invested: 120000,
      currentValue: 122837.50,
      pnl: 2837.50,
      pnlPercent: 2.36,
      sector: 'Oil & Gas'
    },
    {
      symbol: 'TCS',
      quantity: 30,
      avgPrice: 3600.00,
      ltp: 3678.90,
      invested: 108000,
      currentValue: 110367.00,
      pnl: 2367.00,
      pnlPercent: 2.19,
      sector: 'IT'
    },
    {
      symbol: 'HDFCBANK',
      quantity: 75,
      avgPrice: 1680.00,
      ltp: 1645.20,
      invested: 126000,
      currentValue: 123390.00,
      pnl: -2610.00,
      pnlPercent: -2.07,
      sector: 'Banking'
    },
    {
      symbol: 'INFY',
      quantity: 100,
      avgPrice: 1420.00,
      ltp: 1456.80,
      invested: 142000,
      currentValue: 145680.00,
      pnl: 3680.00,
      pnlPercent: 2.59,
      sector: 'IT'
    }
  ];

  const portfolioHistory = [
    { date: '2024-01-01', value: 500000 },
    { date: '2024-01-05', value: 505000 },
    { date: '2024-01-10', value: 498000 },
    { date: '2024-01-15', value: 512000 },
    { date: '2024-01-20', value: 518000 },
    { date: '2024-01-25', value: 502274.50 },
  ];

  const sectorAllocation = [
    { name: 'IT', value: 256047, color: '#0EA5E9' },
    { name: 'Banking', value: 123390, color: '#EF4444' },
    { name: 'Oil & Gas', value: 122837.50, color: '#10B981' },
  ];

  const totalInvested = holdings.reduce((sum, holding) => sum + holding.invested, 0);
  const totalCurrentValue = holdings.reduce((sum, holding) => sum + holding.currentValue, 0);
  const totalPnL = totalCurrentValue - totalInvested;
  const totalPnLPercent = (totalPnL / totalInvested) * 100;

  // Add derivatives positions to portfolio
  const derivativesPnL = positions.reduce((sum, pos) => sum + pos.pnl, 0);
  const derivativesInvested = positions.reduce((sum, pos) => sum + (pos.avgPrice * Math.abs(pos.quantity)), 0);

  const periods = ['1D', '1W', '1M', '3M', '6M', '1Y'];

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please Login</h2>
          <p className="text-gray-400">You need to login to access portfolio features.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Portfolio</h2>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            {periods.map(period => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  selectedPeriod === period
                    ? 'bg-primary text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-5 h-5 text-primary" />
            <span className="text-sm text-gray-400">Total Invested</span>
          </div>
          <div className="text-2xl font-bold">₹{(totalInvested + derivativesInvested).toLocaleString()}</div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-secondary" />
            <span className="text-sm text-gray-400">Current Value</span>
          </div>
          <div className="text-2xl font-bold">₹{(totalCurrentValue + derivativesInvested + derivativesPnL).toLocaleString()}</div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            {(totalPnL + derivativesPnL) >= 0 ? (
              <TrendingUp className="w-5 h-5 text-secondary" />
            ) : (
              <TrendingDown className="w-5 h-5 text-danger" />
            )}
            <span className="text-sm text-gray-400">Total P&L</span>
          </div>
          <div className={`text-2xl font-bold ${(totalPnL + derivativesPnL) >= 0 ? 'text-secondary' : 'text-danger'}`}>
            ₹{(totalPnL + derivativesPnL).toLocaleString()}
          </div>
          <div className={`text-sm ${(totalPnL + derivativesPnL) >= 0 ? 'text-secondary' : 'text-danger'}`}>
            {((totalPnL + derivativesPnL) / (totalInvested + derivativesInvested) * 100).toFixed(2)}%
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-accent" />
            <span className="text-sm text-gray-400">Day's Change</span>
          </div>
          <div className="text-2xl font-bold text-secondary">+₹2,450</div>
          <div className="text-sm text-secondary">+0.49%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolio Performance Chart */}
        <div className="lg:col-span-2 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold mb-4">Portfolio Performance</h3>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={portfolioHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #4B5563',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Portfolio Value']}
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#0EA5E9" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sector Allocation */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Sector Allocation
          </h3>
          
          <div className="h-48 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={sectorAllocation}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sectorAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #4B5563',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Value']}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-2">
            {sectorAllocation.map((sector) => (
              <div key={sector.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: sector.color }}
                  ></div>
                  <span className="text-sm">{sector.name}</span>
                </div>
                <span className="text-sm font-semibold">
                  {((sector.value / totalCurrentValue) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Holdings */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-semibold mb-4">Holdings</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left py-3 px-4">Symbol</th>
                <th className="text-right py-3 px-4">Qty</th>
                <th className="text-right py-3 px-4">Avg Price</th>
                <th className="text-right py-3 px-4">LTP</th>
                <th className="text-right py-3 px-4">Invested</th>
                <th className="text-right py-3 px-4">Current Value</th>
                <th className="text-right py-3 px-4">P&L</th>
                <th className="text-right py-3 px-4">P&L %</th>
                <th className="text-left py-3 px-4">Sector</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((holding) => (
                <tr key={holding.symbol} className="border-b border-gray-700 hover:bg-gray-750">
                  <td className="py-3 px-4 font-semibold">{holding.symbol}</td>
                  <td className="py-3 px-4 text-right">{holding.quantity}</td>
                  <td className="py-3 px-4 text-right">₹{holding.avgPrice.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right">₹{holding.ltp.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right">₹{holding.invested.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right">₹{holding.currentValue.toLocaleString()}</td>
                  <td className={`py-3 px-4 text-right font-semibold ${
                    holding.pnl >= 0 ? 'text-secondary' : 'text-danger'
                  }`}>
                    ₹{holding.pnl.toLocaleString()}
                  </td>
                  <td className={`py-3 px-4 text-right font-semibold ${
                    holding.pnlPercent >= 0 ? 'text-secondary' : 'text-danger'
                  }`}>
                    {holding.pnlPercent >= 0 ? '+' : ''}{holding.pnlPercent.toFixed(2)}%
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-gray-600 text-xs px-2 py-1 rounded">
                      {holding.sector}
                    </span>
                  </td>
                </tr>
              ))}
              
              {/* Derivatives Positions */}
              {positions.map((position) => (
                <tr key={`pos-${position.id}`} className="border-b border-gray-700 hover:bg-gray-750">
                  <td className="py-3 px-4 font-semibold">{position.symbol}</td>
                  <td className="py-3 px-4 text-right">{position.quantity}</td>
                  <td className="py-3 px-4 text-right">₹{position.avgPrice.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right">₹{position.ltp.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right">₹{(position.avgPrice * Math.abs(position.quantity)).toLocaleString()}</td>
                  <td className="py-3 px-4 text-right">₹{(position.ltp * Math.abs(position.quantity)).toLocaleString()}</td>
                  <td className={`py-3 px-4 text-right font-semibold ${
                    position.pnl >= 0 ? 'text-secondary' : 'text-danger'
                  }`}>
                    ₹{position.pnl.toLocaleString()}
                  </td>
                  <td className={`py-3 px-4 text-right font-semibold ${
                    position.pnlPercent >= 0 ? 'text-secondary' : 'text-danger'
                  }`}>
                    {position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-purple-600 text-xs px-2 py-1 rounded">
                      Derivatives
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PortfolioView;