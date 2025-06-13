import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Settings, TrendingUp, X, Plus } from 'lucide-react';

const ChartsView: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState('NIFTY50');
  const [selectedIndicators, setSelectedIndicators] = useState(['CPR', 'Supertrend']);
  const [showIndicatorSettings, setShowIndicatorSettings] = useState(false);
  const [indicatorSettings, setIndicatorSettings] = useState({
    CPR: { period: 1 },
    Supertrend: { period: 10, multiplier: 3 },
    VWAP: { period: 14 },
    RSI: { period: 14, overbought: 70, oversold: 30 },
    EMA20: { period: 20 },
    EMA200: { period: 200 },
    MACD: { fast: 12, slow: 26, signal: 9 },
    OI: { display: 'volume' },
    Volume: { period: 20 },
    HeikinAshi: { smoothing: 1 },
    BollingerBands: { period: 20, deviation: 2 },
    MarketStructure: { lookback: 50 },
    PA: { sensitivity: 'medium' }
  });

  const availableIndicators = [
    'CPR', 'Supertrend', 'VWAP', 'RSI', 'EMA20', 'EMA200', 'MACD', 
    'OI', 'Volume', 'HeikinAshi', 'BollingerBands', 'MarketStructure', 'PA'
  ];

  const indicatorCombos = [
    { name: 'CPR + Supertrend (Intraday)', indicators: ['CPR', 'Supertrend'] },
    { name: 'VWAP + RSI (Scalping)', indicators: ['VWAP', 'RSI'] },
    { name: 'EMA 20/200 + MACD (Swing)', indicators: ['EMA20', 'EMA200', 'MACD'] },
    { name: 'OI + Supertrend (Options)', indicators: ['OI', 'Supertrend'] },
    { name: 'PA + Volume + ST (Breakouts)', indicators: ['PA', 'Volume', 'Supertrend'] },
    { name: 'CPR + VWAP + ST (Triple confirmation)', indicators: ['CPR', 'VWAP', 'Supertrend'] },
    { name: 'Heikin Ashi + ST (Clean trend)', indicators: ['HeikinAshi', 'Supertrend'] },
    { name: 'Bollinger Bands + RSI Divergence (Reversals)', indicators: ['BollingerBands', 'RSI'] },
    { name: 'Market Structure + CPR + OI (Macro view)', indicators: ['MarketStructure', 'CPR', 'OI'] }
  ];

  const indices = ['NIFTY50', 'BANKNIFTY', 'NIFTYIT', 'NIFTYFMCG', 'NIFTYFINANCIAL', 'NIFTYMIDCAP50', 'NIFTYSMALLCAP100'];

  // Mock chart data
  const chartData = Array.from({ length: 50 }, (_, i) => ({
    time: `${9 + Math.floor(i / 10)}:${(i % 10) * 6}`,
    price: 19000 + Math.random() * 500 - 250,
    volume: Math.random() * 1000000,
  }));

  const addIndicator = (indicator: string) => {
    if (!selectedIndicators.includes(indicator)) {
      setSelectedIndicators([...selectedIndicators, indicator]);
    }
  };

  const removeIndicator = (indicator: string) => {
    setSelectedIndicators(selectedIndicators.filter(ind => ind !== indicator));
  };

  const addComboIndicators = (indicators: string[]) => {
    const newIndicators = [...selectedIndicators];
    indicators.forEach(indicator => {
      if (!newIndicators.includes(indicator)) {
        newIndicators.push(indicator);
      }
    });
    setSelectedIndicators(newIndicators);
  };

  const updateIndicatorSetting = (indicator: string, setting: string, value: any) => {
    setIndicatorSettings(prev => ({
      ...prev,
      [indicator]: {
        ...prev[indicator],
        [setting]: value
      }
    }));
  };

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
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-semibold">{selectedIndex}</h3>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-secondary" />
              <span className="text-secondary">19,245.30 (+0.82%)</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowIndicatorSettings(!showIndicatorSettings)}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
              Indicators
            </button>
          </div>
        </div>

        {/* Active Indicators */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-sm text-gray-400">Active:</span>
          {selectedIndicators.map(indicator => (
            <div key={indicator} className="flex items-center gap-1 bg-primary/20 text-primary px-2 py-1 rounded text-xs">
              <span>{indicator}</span>
              <button
                onClick={() => removeIndicator(indicator)}
                className="hover:bg-primary/30 rounded p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Indicator Settings Panel */}
        {showIndicatorSettings && (
          <div className="bg-gray-750 rounded-lg p-4 mb-4 border border-gray-600">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Combo Indicators */}
              <div>
                <h4 className="font-semibold mb-3">Combo Indicators</h4>
                <div className="space-y-2">
                  {indicatorCombos.map((combo, index) => (
                    <button
                      key={index}
                      onClick={() => addComboIndicators(combo.indicators)}
                      className="w-full text-left bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded text-sm transition-colors"
                    >
                      <div className="font-medium">{combo.name.split(' (')[0]}</div>
                      <div className="text-xs text-gray-400">({combo.name.split(' (')[1]}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Individual Indicators */}
              <div>
                <h4 className="font-semibold mb-3">Individual Indicators</h4>
                <div className="grid grid-cols-2 gap-2">
                  {availableIndicators.map(indicator => (
                    <button
                      key={indicator}
                      onClick={() => addIndicator(indicator)}
                      disabled={selectedIndicators.includes(indicator)}
                      className={`flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                        selectedIndicators.includes(indicator)
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-700 hover:bg-gray-600 text-white'
                      }`}
                    >
                      <Plus className="w-3 h-3" />
                      {indicator}
                    </button>
                  ))}
                </div>
              </div>

              {/* Indicator Settings */}
              <div>
                <h4 className="font-semibold mb-3">Settings</h4>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {selectedIndicators.map(indicator => (
                    <div key={indicator} className="bg-gray-800 rounded p-3">
                      <h5 className="font-medium mb-2 text-sm">{indicator}</h5>
                      <div className="space-y-2">
                        {Object.entries(indicatorSettings[indicator] || {}).map(([setting, value]) => (
                          <div key={setting} className="flex items-center justify-between">
                            <label className="text-xs text-gray-400 capitalize">{setting}:</label>
                            {typeof value === 'number' ? (
                              <input
                                type="number"
                                value={value}
                                onChange={(e) => updateIndicatorSetting(indicator, setting, parseFloat(e.target.value))}
                                className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs w-16"
                              />
                            ) : (
                              <select
                                value={value}
                                onChange={(e) => updateIndicatorSetting(indicator, setting, e.target.value)}
                                className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs"
                              >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                              </select>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chart */}
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

        {/* OHLC Data */}
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
  );
};

export default ChartsView;