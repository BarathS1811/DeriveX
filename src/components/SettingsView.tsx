import React, { useState } from 'react';
import { Settings, Database, Newspaper, Key, Save, TestTube } from 'lucide-react';

const SettingsView: React.FC = () => {
  const [marketDataAPI, setMarketDataAPI] = useState({
    provider: 'ICICI Direct Breeze',
    apiKey: '',
    apiSecret: '',
    status: 'Disconnected'
  });

  const [newsAPI, setNewsAPI] = useState({
    provider: 'Open News Platform',
    apiKey: '',
    customProvider: '',
    status: 'Disconnected'
  });

  const [refreshInterval, setRefreshInterval] = useState(30);
  const [notifications, setNotifications] = useState({
    priceAlerts: true,
    newsAlerts: true,
    technicalSignals: true
  });

  const marketDataProviders = [
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

  const testMarketDataConnection = () => {
    if (!marketDataAPI.apiKey || !marketDataAPI.apiSecret) {
      alert('Please enter API Key and Secret');
      return;
    }
    
    // Simulate API test
    setTimeout(() => {
      setMarketDataAPI(prev => ({ ...prev, status: 'Connected' }));
      alert('Market Data API connection successful!');
    }, 2000);
  };

  const testNewsConnection = () => {
    if (!newsAPI.apiKey && newsAPI.provider !== 'Open News Platform') {
      alert('Please enter API Key for selected provider');
      return;
    }
    
    // Simulate API test
    setTimeout(() => {
      setNewsAPI(prev => ({ ...prev, status: 'Connected' }));
      alert('News API connection successful!');
    }, 2000);
  };

  const saveSettings = () => {
    // Save settings to localStorage or backend
    const settings = {
      marketDataAPI,
      newsAPI,
      refreshInterval,
      notifications
    };
    
    localStorage.setItem('marketAISettings', JSON.stringify(settings));
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
            </div>

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

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Status:</span>
                <span className={`text-sm font-semibold ${
                  marketDataAPI.status === 'Connected' ? 'text-secondary' : 'text-danger'
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
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={notifications.priceAlerts}
                  onChange={(e) => setNotifications(prev => ({ ...prev, priceAlerts: e.target.checked }))}
                  className="rounded bg-gray-700 border-gray-600"
                />
                <span className="text-sm">Price Alerts</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={notifications.newsAlerts}
                  onChange={(e) => setNotifications(prev => ({ ...prev, newsAlerts: e.target.checked }))}
                  className="rounded bg-gray-700 border-gray-600"
                />
                <span className="text-sm">News Alerts</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={notifications.technicalSignals}
                  onChange={(e) => setNotifications(prev => ({ ...prev, technicalSignals: e.target.checked }))}
                  className="rounded bg-gray-700 border-gray-600"
                />
                <span className="text-sm">Technical Signals</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* API Integration Guide */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Key className="w-5 h-5" />
          API Integration Guide
        </h3>
        
        <div className="space-y-4 text-sm text-gray-300">
          <div>
            <h4 className="font-semibold mb-2">Market Data API Setup:</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>Register with your preferred broker (ICICI Direct, Upstox, etc.)</li>
              <li>Generate API credentials from their developer portal</li>
              <li>Enter the API key and secret in the settings above</li>
              <li>Test the connection to ensure data flow</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">News API Setup:</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>Open News Platform provides free economic news (no API key required)</li>
              <li>For premium news sources, register with providers like Reuters or Bloomberg</li>
              <li>Enter your news API key for enhanced news analysis</li>
              <li>Custom APIs can be configured for proprietary news sources</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;