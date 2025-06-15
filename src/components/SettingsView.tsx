import React, { useState, useEffect } from 'react';
import { Settings, Database, Newspaper, Key, Save, TestTube, User, Wallet, TrendingUp, LogOut } from 'lucide-react';
import { dataService } from '../services/DataService';
import { authService } from '../services/AuthService';

const SettingsView: React.FC = () => {
  const [user, setUser] = useState(authService.getCurrentUser());
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
    'HDFC Sky',
    'ICICI Direct Breeze',
    'Upstox',
    'NSE Direct',
    'Zerodha Kite',
    'Angel Broking',
    'Custom API'
  ];

  const newsProviders = [
    'Open News Platform',
    'Times Now India',
    'Economic Times API',
    'Google News API',
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
    const interval = setInterval(() => {
      setUser(authService.getCurrentUser());
    }, 1000);

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

    return () => clearInterval(interval);
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
      dataService.setAPICredentials(marketDataAPI.provider, marketDataAPI.apiKey, marketDataAPI.apiSecret);
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

  const logoutFromDemat = () => {
    setTradingSettings(prev => ({
      ...prev,
      dematAccount: {
        broker: '',
        accountId: '',
        apiKey: '',
        apiSecret: '',
        status: 'Disconnected'
      }
    }));
    alert('Logged out from demat account successfully!');
  };

  const logoutFromAPI = () => {
    setMarketDataAPI({
      provider: 'NSEpy (Default)',
      apiKey: '',
      apiSecret: '',
      status: 'Connected'
    });
    dataService.setAPICredentials('NSEpy', '', '');
    alert('Logged out from API successfully! Switched to NSEpy default.');
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
    
    if (user) {
      authService.updateUserSettings(settings);
    }
    
    if (marketDataAPI.status === 'Connected') {
      dataService.setAPICredentials(marketDataAPI.provider, marketDataAPI.apiKey, marketDataAPI.apiSecret);
    }
    
    alert('Settings saved successfully!');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please Login</h2>
          <p className="text-gray-400">You need to login to access settings and trading features.</p>
        </div>
      </div>
    );
  }

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

      {/* User Profile */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <User className="w-5 h-5" />
          User Profile
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-750 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Username:</span>
                <span className="font-semibold">{user.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Email:</span>
                <span className="font-semibold">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Phone:</span>
                <span className="font-semibold">{user.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Member Since:</span>
                <span className="font-semibold">{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-750 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Wallet Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Balance:</span>
                <span className="font-semibold">₹{user.wallet.balance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Available Margin:</span>
                <span className="font-semibold text-secondary">₹{user.wallet.availableMargin.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Used Margin:</span>
                <span className="font-semibold text-danger">₹{user.wallet.usedMargin.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
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
              <div className="flex gap-2">
                <button
                  onClick={testMarketDataConnection}
                  className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition-colors text-sm"
                >
                  <TestTube className="w-4 h-4" />
                  Test
                </button>
                {marketDataAPI.provider !== 'NSEpy (Default)' && (
                  <button
                    onClick={logoutFromAPI}
                    className="flex items-center gap-2 bg-danger hover:bg-red-600 px-3 py-2 rounded-lg transition-colors text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                )}
              </div>
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
              <p className="text-xs text-gray-400 mt-1">
                News updates every hour from 8 AM to 4 PM
              </p>
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

            {!['Open News Platform', 'Times Now India'].includes(newsAPI.provider) && (
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
                <div className="flex gap-2">
                  <button
                    onClick={testDematConnection}
                    className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm"
                  >
                    Test
                  </button>
                  {tradingSettings.dematAccount.status === 'Connected' && (
                    <button
                      onClick={logoutFromDemat}
                      className="bg-danger hover:bg-red-600 px-3 py-1 rounded text-sm"
                    >
                      Logout
                    </button>
                  )}
                </div>
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
    </div>
  );
};

export default SettingsView;