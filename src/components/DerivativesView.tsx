import React, { useState, useEffect } from 'react';
import { Zap, Calculator, TrendingUp, Activity, BarChart, Clock, Settings, X, Plus } from 'lucide-react';
import CandlestickChart from './CandlestickChart';
import { dataService } from '../services/DataService';
import { tradingService } from '../services/TradingService';
import { authService } from '../services/AuthService';

const DerivativesView: React.FC = () => {
  const [selectedContract, setSelectedContract] = useState('NIFTY50-CE-19300');
  const [selectedSegment, setSelectedSegment] = useState('Options');
  const [chartData, setChartData] = useState<any[]>([]);
  const [timeframe, setTimeframe] = useState('5m');
  const [selectedIndicators, setSelectedIndicators] = useState(['Supertrend', 'RSI']);
  const [showIndicatorSettings, setShowIndicatorSettings] = useState(false);
  const [dataTimestamp, setDataTimestamp] = useState(new Date());
  const [isLiveData, setIsLiveData] = useState(false);

  // Order placement state
  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(125.50);
  const [orderMode, setOrderMode] = useState('LIMIT');
  const [stopLoss, setStopLoss] = useState<number | undefined>();
  const [target1, setTarget1] = useState<number | undefined>();
  const [target2, setTarget2] = useState<number | undefined>();

  const [indicatorSettings, setIndicatorSettings] = useState({
    CPR: { 
      pivotMode: 'Auto',
      showDaily: true,
      showWeekly: false,
      showMonthly: false,
      showNextDay: false,
      showNextWeek: false,
      showNextMonth: false,
      inputsInStatusLine: true
    },
    Supertrend: { 
      indicatorTimeframe: 'Chart',
      atrPeriod: 9,
      source: 'HL2',
      atrMultiplier: 2,
      changeATRCalculationMethod: true,
      showBuySellSignals: true,
      highlighterOnOff: true,
      inputsInStatusLine: true
    },
    VWAP: { 
      hideVWAPOn1DOrAbove: false,
      anchorPeriod: 'Session',
      source: 'HLC3',
      offset: 0,
      bandsCalculationMode: 'Standard',
      bandsMultiplier1: 1,
      bandsMultiplier2: 2,
      bandsMultiplier3: 3,
      timeframe: 'Chart'
    },
    RSI: { period: 14, overbought: 70, oversold: 30 },
    EMA20: { period: 20 },
    EMA200: { period: 200 },
    MACD: { fast: 12, slow: 26, signal: 9 },
    BollingerBands: { period: 20, deviation: 2 }
  });

  const availableIndicators = [
    'CPR', 'Supertrend', 'VWAP', 'RSI', 'EMA20', 'EMA200', 'MACD', 
    'BollingerBands'
  ];

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

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const underlyingSymbol = selectedContract.split('-')[0];
        const candlestickData = await dataService.getCandlestickData(underlyingSymbol, timeframe);
        
        // Adjust data for derivative pricing (simplified)
        const adjustedData = candlestickData.map(candle => ({
          ...candle,
          open: candle.open * 0.01,
          high: candle.high * 0.01,
          low: candle.low * 0.01,
          close: candle.close * 0.01,
        }));
        
        setChartData(adjustedData);
        setDataTimestamp(dataService.getDataTimestamp());
        setIsLiveData(dataService.isLiveData());
      } catch (error) {
        console.error('Error fetching derivative chart data:', error);
      }
    };

    fetchChartData();
    const interval = setInterval(fetchChartData, 30000);

    return () => clearInterval(interval);
  }, [selectedContract, timeframe]);

  const currentData = selectedSegment === 'Options' ? derivatives : futures;
  const selectedData = currentData.find(item => item.symbol === selectedContract);

  const addIndicator = (indicator: string) => {
    if (!selectedIndicators.includes(indicator)) {
      setSelectedIndicators([...selectedIndicators, indicator]);
    }
  };

  const removeIndicator = (indicator: string) => {
    setSelectedIndicators(selectedIndicators.filter(ind => ind !== indicator));
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

  const placeOrder = () => {
    if (!authService.isLoggedIn()) {
      alert('Please login to place orders');
      return;
    }

    const orderData = {
      symbol: selectedContract,
      type: orderType,
      quantity,
      price: orderMode === 'MARKET' ? selectedData?.ltp || price : price,
      orderType: orderMode as any,
      stopLoss,
      target1,
      target2
    };

    const result = tradingService.placeOrder(orderData);
    alert(result.message);

    if (result.success) {
      // Reset form
      setQuantity(1);
      setStopLoss(undefined);
      setTarget1(undefined);
      setTarget2(undefined);
    }
  };

  const calculateSuggestedLevels = () => {
    if (!selectedData) return { sl: 0, t1: 0, t2: 0 };
    
    const currentPrice = selectedData.ltp;
    const sl = orderType === 'BUY' ? currentPrice * 0.95 : currentPrice * 1.05;
    const t1 = orderType === 'BUY' ? currentPrice * 1.05 : currentPrice * 0.95;
    const t2 = orderType === 'BUY' ? currentPrice * 1.10 : currentPrice * 0.90;
    
    return { sl, t1, t2 };
  };

  const suggestedLevels = calculateSuggestedLevels();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Derivatives Analysis</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <div className="text-sm text-gray-400">
              {isLiveData ? 'Live Data' : 'Delayed Data'} - {dataTimestamp.toLocaleString()}
            </div>
          </div>
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
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chart */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <BarChart className="w-5 h-5" />
                {selectedContract} Live Chart
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowIndicatorSettings(!showIndicatorSettings)}
                  className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Indicators
                </button>
                <div className="text-sm text-gray-400">
                  Last: ₹{selectedData?.ltp} ({selectedData?.change >= 0 ? '+' : ''}{selectedData?.change})
                </div>
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Available Indicators */}
                  <div>
                    <h4 className="font-semibold mb-3">Available Indicators</h4>
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
                                <label className="text-xs text-gray-400 capitalize">{setting.replace(/([A-Z])/g, ' $1').trim()}:</label>
                                {typeof value === 'number' ? (
                                  <input
                                    type="number"
                                    value={value}
                                    onChange={(e) => updateIndicatorSetting(indicator, setting, parseFloat(e.target.value))}
                                    className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs w-16"
                                  />
                                ) : typeof value === 'boolean' ? (
                                  <input
                                    type="checkbox"
                                    checked={value}
                                    onChange={(e) => updateIndicatorSetting(indicator, setting, e.target.checked)}
                                    className="rounded"
                                  />
                                ) : (
                                  <select
                                    value={value}
                                    onChange={(e) => updateIndicatorSetting(indicator, setting, e.target.value)}
                                    className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs"
                                  >
                                    <option value="Auto">Auto</option>
                                    <option value="Chart">Chart</option>
                                    <option value="Session">Session</option>
                                    <option value="HL2">HL2</option>
                                    <option value="HLC3">HLC3</option>
                                    <option value="Standard">Standard</option>
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
            
            <CandlestickChart
              data={chartData}
              indicators={selectedIndicators}
              indicatorSettings={indicatorSettings}
              timeframe={timeframe}
              onTimeframeChange={setTimeframe}
            />
          </div>
        </div>

        {/* Order Placement Panel */}
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Place Order</h3>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setOrderType('BUY')}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                    orderType === 'BUY'
                      ? 'bg-secondary text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  BUY
                </button>
                <button
                  onClick={() => setOrderType('SELL')}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                    orderType === 'SELL'
                      ? 'bg-danger text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  SELL
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Order Type
                </label>
                <select
                  value={orderMode}
                  onChange={(e) => setOrderMode(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="LIMIT">LIMIT</option>
                  <option value="MARKET">MARKET</option>
                  <option value="SL">STOP LOSS</option>
                  <option value="SL-M">SL-MARKET</option>
                </select>
              </div>

              {orderMode !== 'MARKET' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Stop Loss
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.05"
                    value={stopLoss || ''}
                    onChange={(e) => setStopLoss(e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="Optional"
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm"
                  />
                  <button
                    onClick={() => setStopLoss(suggestedLevels.sl)}
                    className="bg-gray-600 hover:bg-gray-500 px-3 py-2 rounded-lg text-xs"
                  >
                    Suggest
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Target 1
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.05"
                    value={target1 || ''}
                    onChange={(e) => setTarget1(e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="Optional"
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm"
                  />
                  <button
                    onClick={() => setTarget1(suggestedLevels.t1)}
                    className="bg-gray-600 hover:bg-gray-500 px-3 py-2 rounded-lg text-xs"
                  >
                    Suggest
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Target 2
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.05"
                    value={target2 || ''}
                    onChange={(e) => setTarget2(e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="Optional"
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm"
                  />
                  <button
                    onClick={() => setTarget2(suggestedLevels.t2)}
                    className="bg-gray-600 hover:bg-gray-500 px-3 py-2 rounded-lg text-xs"
                  >
                    Suggest
                  </button>
                </div>
              </div>

              <button
                onClick={placeOrder}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                  orderType === 'BUY'
                    ? 'bg-secondary hover:bg-green-600 text-white'
                    : 'bg-danger hover:bg-red-600 text-white'
                }`}
              >
                {orderType} {selectedContract}
              </button>
            </div>
          </div>

          {/* Contract Details */}
          {selectedData && (
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Contract Details</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">LTP:</span>
                  <span className="font-semibold">₹{selectedData.ltp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Change:</span>
                  <span className={`font-semibold ${selectedData.change >= 0 ? 'text-secondary' : 'text-danger'}`}>
                    {selectedData.change >= 0 ? '+' : ''}{selectedData.change}
                  </span>
                </div>
                {selectedSegment === 'Options' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-400">IV:</span>
                      <span className="font-semibold">{selectedData.iv}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Strike:</span>
                      <span className="font-semibold">{selectedData.strike}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">OI:</span>
                  <span className="font-semibold">{(selectedData.oi / 1000000).toFixed(2)}M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Volume:</span>
                  <span className="font-semibold">{(selectedData.volume / 1000).toFixed(0)}K</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DerivativesView;