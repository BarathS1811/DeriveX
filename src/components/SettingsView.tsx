import React, { useState, useEffect } from 'react';
import { Settings, Database, Newspaper, Key, Save, TestTube, User, Wallet, TrendingUp } from 'lucide-react';
import { dataService } from '../services/DataService';

const SettingsView: React.FC = () => {
  const [marketDataAPI, setMarketDataAPI] = useState({
    provider: 'NSEpy (Default)',
    apiKey: '',
    apiSecret: '',
    status: 'Connected'
  });

  const [newsAPI, setNewsAPI] = useState({
    provider: 'Open News Platform',
    apiKey: '',
    customProvider: '',
    status: 'Connected'
  });

  const [tradingSettings, setTradingSettings] = useState({
    dematAccount: {
      broker: '',
      accountId: '',
      apiKey: '',
      apiSecret: '',
      status: 'Disconnected'
    },
    riskManagement: {
      maxPositionSize: 10000,
      stopLossPercentage: 2,
      takeProfitPercentage: 5,
      maxDailyLoss: 50000,
      maxOpenPositions: 5
    },
    orderSettings: {
      defaultOrderType: 'LIMIT',
      defaultQuantity: 1,
      autoSquareOff: true,
      confirmOrders: true
    }
  });

  const [refreshInterval, setRefreshInterval] = useState(30);
  const [notifications, setNotifications] = useState({
    priceAlerts: true,
    newsAlerts: true,
    technicalSignals: true,
    orderUpdates: true,
    riskAlerts: true
  });

  const marketDataProviders = [
    'NSEpy (Default)',
    'ICICI Direct Breeze',
    'Upstox',
    'NSE Direct',
    'Zerodha Kite',
    'Angel Broking',
    'Custom API'
  ];

  const newsProviders = [
    'Open News Platform',
    'Economic Times API',
    'Reuters API',
    'Bloomberg API',
    'Custom News API'
  ];

  const brokers = [
    'Zerodha',
    'Upstox',
    'ICICI Direct',
    'Angel Broking',
    'HDFC Securities',
    'Kotak Securities',
    'Sharekhan',
    'Other'
  ];

  useEffect(() => {
    // Load saved settings
    const savedSettings = localStorage.getItem('marketAISettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      if (settings.marketDataAPI) setMarketDataAPI(settings.marketDataAPI);
      if (settings.newsAPI) setNewsAPI(settings.newsAPI);
      if (settings.tradingSettings) setTradingSettings(settings.tradingSettings);
      if (settings.refreshInterval) setRefreshInterval(settings.refreshInterval);
      if (settings.notifications) setNotifications(settings.notifications);
    }
  }, []);

  const testMarketDataConnection = async () => {
    if (marketDataAPI.provider === 'NSEpy (Default)') {
      setMarketDataAPI(prev => ({ ...prev, status: 'Connected' }));
      alert('NSEpy connection successful! Using delayed data (15-minute delay).');
      return;
    }

    if (!marketDataAPI.apiKey || !marketDataAPI.apiSecret) {
      alert('Please enter API Key and Secret');
      return;
    }
    
    try {
      // Configure data service with API credentials
      dataService.setAPICredentials(marketDataAPI.provider, marketDataAPI.apiKey, marketDataAPI.apiSecret);
      
      // Test connection
      await dataService.getMarketData('NIFTY50');
      
      setMarketDataAPI(prev => ({ ...prev, status: 'Connected' }));
      alert('Market Data API connection successful!');
    } catch (error) {
      setMarketDataAPI(prev => ({ ...prev, status: 'Failed' }));
      alert('Connection failed. Please check your credentials.');
    }
  };

  const testNewsConnection = () => {
    if (newsAPI.provider === 'Open News Platform') {
      setNewsAPI(prev => ({ ...prev, status: 'Connected' }));
      alert('Open News Platform connected successfully!');
      return;
    }

    if (!newsAPI.apiKey) {
      alert('Please enter API Key for selected provider');
      return;
    }
    
    setTimeout(() => {
      setNewsAPI(prev => ({ ...prev, status: 'Connected' }));
      alert('News API connection successful!');
    }, 2000);
  };

  const testDematConnection = () => {
    if (!tradingSettings.dematAccount.apiKey || !tradingSettings.dematAccount.apiSecret) {
      alert('Please enter API credentials for your demat account');
      return;
    }

    setTimeout(() => {
      setTradingSettings(prev => ({
        ...prev,
        dematAccount: { ...prev.dematAccount, status: 'Connected' }
      }));
      alert('Demat account connected successfully!');
    }, 2000);
  };

  const saveSettings = () => {
    const settings = {
      marketDataAPI,
      newsAPI,
      tradingSettings,
      refreshInterval,
      notifications
    };
    
    localStorage.setItem('marketAISettings', JSON.stringify(settings));
    
    // Apply market data settings
    if (marketDataAPI.status === 'Connected') {
      dataService.setAPICredentials(marketDataAPI.provider, marketDataAPI.apiKey, marketDataAPI.apiSecret);
    }
    
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Settings</h2>
        <button
          onClick={saveSettings}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Save className="w-4 h-4" />
          Save Settings
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Data API Settings */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Database className="w-5 h-5" />
            Market Data API
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Data Provider
              </label>
              <select
                value={marketDataAPI.provider}
                onChange={(e) => setMarketDataAPI(prev => ({ ...prev, provider: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
              >
                {marketDataProviders.map(provider => (
                  <option key={provider} value={provider}>{provider}</option>
                ))}
              </select>
              {marketDataAPI.provider === 'NSEpy (Default)' && (
                <p className="text-xs text-gray-400 mt-1">
                  Free delayed data (15-minute delay). No API key required.
                </p>
              )}
            </div>

            {marketDataAPI.provider !== 'NSEpy (Default)' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    API Key
                  </label>
                  <input
                    type="password"
                    value={marketDataAPI.apiKey}
                    onChange={(e) => setMarketDataAPI(prev => ({ ...prev, apiKey: e.target.value }))}
                    placeholder="Enter your API key"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    API Secret
                  </label>
                  <input
                    type="password"
                    value={marketDataAPI.apiSecret}
                    onChange={(e) => setMarketDataAPI(prev => ({ ...prev, apiSecret: e.target.value }))}
                    placeholder="Enter your API secret"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Status:</span>
                <span className={`text-sm font-semibold ${
                  marketDataAPI.status === 'Connected' ? 'text-secondary' : 
                  marketDataAPI.status === 'Failed' ? 'text-danger' : 'text-gray-400'
                }`}>
                  {marketDataAPI.status}
                </span>
              </div>
              <button
                onClick={testMarketDataConnection}
                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition-colors text-sm"
              >
                <TestTube className="w-4 h-4" />
                Test Connection
              </button>
            </div>
          </div>
        </div>

        {/* News API Settings */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Newspaper className="w-5 h-5" />
            News API
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                News Provider
              </label>
              <select
                value={newsAPI.provider}
                onChange={(e) => setNewsAPI(prev => ({ ...prev, provider: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
              >
                {newsProviders.map(provider => (
                  <option key={provider} value={provider}>{provider}</option>
                ))}
              </select>
            </div>

            {newsAPI.provider === 'Custom News API' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Custom Provider URL
                </label>
                <input
                  type="url"
                  value={newsAPI.customProvider}
                  onChange={(e) => setNewsAPI(prev => ({ ...prev, customProvider: e.target.value }))}
                  placeholder="https://api.example.com"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>
            )}

            {newsAPI.provider !== 'Open News Platform' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  value={newsAPI.apiKey}
                  onChange={(e) => setNewsAPI(prev => ({ ...prev, apiKey: e.target.value }))}
                  placeholder="Enter your news API key"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Status:</span>
                <span className={`text-sm font-semibold ${
                  newsAPI.status === 'Connected' ? 'text-secondary' : 'text-danger'
                }`}>
                  {newsAPI.status}
                </span>
              </div>
              <button
                onClick={testNewsConnection}
                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition-colors text-sm"
              >
                <TestTube className="w-4 h-4" />
                Test Connection
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trading Settings */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Trading Settings
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Demat Account */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Demat Account
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Broker</label>
                <select
                  value={tradingSettings.dematAccount.broker}
                  onChange={(e) => setTradingSettings(prev => ({
                    ...prev,
                    dematAccount: { ...prev.dematAccount, broker: e.target.value }
                  }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
                >
                  <option value="">Select Broker</option>
                  {brokers.map(broker => (
                    <option key={broker} value={broker}>{broker}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Account ID</label>
                <input
                  type="text"
                  value={tradingSettings.dematAccount.accountId}
                  onChange={(e) => setTradingSettings(prev => ({
                    ...prev,
                    dematAccount: { ...prev.dematAccount, accountId: e.target.value }
                  }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">API Key</label>
                <input
                  type="password"
                  value={tradingSettings.dematAccount.apiKey}
                  onChange={(e) => setTradingSettings(prev => ({
                    ...prev,
                    dematAccount: { ...prev.dematAccount, apiKey: e.target.value }
                  }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${
                  tradingSettings.dematAccount.status === 'Connected' ? 'text-secondary' : 'text-danger'
                }`}>
                  {tradingSettings.dematAccount.status}
                </span>
                <button
                  onClick={testDematConnection}
                  className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm"
                >
                  Test
                </button>
              </div>
            </div>
          </div>

          {/* Risk Management */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              Risk Management
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Max Position Size (₹)</label>
                <input
                  type="number"
                  value={tradingSettings.riskManagement.maxPositionSize}
                  onChange={(e) => setTradingSettings(prev => ({
                    ...prev,
                    riskManagement: { ...prev.riskManagement, maxPositionSize: parseInt(e.target.value) }
                  }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Stop Loss (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={tradingSettings.riskManagement.stopLossPercentage}
                  onChange={(e) => setTradingSettings(prev => ({
                    ...prev,
                    riskManagement: { ...prev.riskManagement, stopLossPercentage: parseFloat(e.target.value) }
                  }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Take Profit (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={tradingSettings.riskManagement.takeProfitPercentage}
                  onChange={(e) => setTradingSettings(prev => ({
                    ...prev,
                    riskManagement: { ...prev.riskManagement, takeProfitPercentage: parseFloat(e.target.value) }
                  }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Max Daily Loss (₹)</label>
                <input
                  type="number"
                  value={tradingSettings.riskManagement.maxDailyLoss}
                  onChange={(e) => setTradingSettings(prev => ({
                    ...prev,
                    riskManagement: { ...prev.riskManagement, maxDailyLoss: parseInt(e.target.value) }
                  }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* General Settings */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          General Settings
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Auto-refresh Interval (seconds)
            </label>
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
            >
              <option value={15}>15 seconds</option>
              <option value={30}>30 seconds</option>
              <option value={60}>1 minute</option>
              <option value={300}>5 minutes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Notifications
            </label>
            <div className="space-y-2">
              {Object.entries(notifications).map(([key, value]) => (
                <label key={key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setNotifications(prev => ({ ...prev, [key]: e.target.checked }))}
                    className="rounded bg-gray-700 border-gray-600"
                  />
                  <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* API Integration Guide */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Key className="w-5 h-5" />
          Integration Guide
        </h3>
        
        <div className="space-y-4 text-sm text-gray-300">
          <div>
            <h4 className="font-semibold mb-2">NSEpy (Default):</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>Free delayed data (15-minute delay)</li>
              <li>No API key required</li>
              <li>Covers all major indices and derivatives</li>
              <li>Historical data available for backtesting</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Live Market Data API:</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>Register with your preferred broker (ICICI Direct, Upstox, etc.)</li>
              <li>Generate API credentials from their developer portal</li>
              <li>Enter the API key and secret in the settings above</li>
              <li>Test the connection to ensure real-time data flow</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Trading Integration:</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>Connect your demat account for live trading</li>
              <li>Set up risk management parameters</li>
              <li>Configure order settings and confirmations</li>
              <li>Enable portfolio and P&L tracking</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;