import React, { useState, useEffect } from 'react';
import { Newspaper, Clock, TrendingUp, AlertTriangle, Search } from 'lucide-react';
import { newsService } from '../services/NewsService';

const NewsView: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState('NIFTY50');
  const [news, setNews] = useState<any[]>([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const indices = ['NIFTY50', 'BANKNIFTY', 'NIFTYIT', 'NIFTYFMCG', 'NIFTYFINANCIAL', 'NIFTYMIDCAP50', 'NIFTYSMALLCAP100'];

  useEffect(() => {
    const updateNews = () => {
      const indexNews = newsService.getNewsForIndex(selectedIndex);
      setNews(indexNews);
      setLastUpdate(newsService.getLastUpdateTime());
    };

    updateNews();
    const interval = setInterval(updateNews, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [selectedIndex]);

  const marketEvents = [
    {
      date: '2024-01-15',
      event: 'RBI Policy Meet - Similar Rate Hold',
      marketReaction: '+1.2%',
      similarity: '92%'
    },
    {
      date: '2023-12-08',
      event: 'GDP Growth Beat Expectations',
      marketReaction: '+0.95%',
      similarity: '87%'
    },
    {
      date: '2023-11-22',
      event: 'High FII Inflows Week',
      marketReaction: '+1.8%',
      similarity: '89%'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">News & Market Signals</h2>
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
          <div className="text-sm text-gray-400">
            Last Update: {lastUpdate.toLocaleTimeString()}
          </div>
          <div className="text-sm text-gray-400">
            AI Confidence: <span className="text-secondary font-semibold">94%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Newspaper className="w-5 h-5" />
              {selectedIndex} Related News
            </h3>
            
            <div className="space-y-4">
              {news.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  No news available for {selectedIndex}
                </div>
              ) : (
                news.map((item, index) => (
                  <div key={index} className="bg-gray-750 rounded-lg p-4 border border-gray-600">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            item.impact === 'High' ? 'bg-danger/20 text-danger' :
                            item.impact === 'Medium' ? 'bg-accent/20 text-accent' :
                            'bg-gray-600 text-gray-300'
                          }`}>
                            {item.impact}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            item.sentiment === 'Positive' ? 'bg-secondary/20 text-secondary' :
                            item.sentiment === 'Negative' ? 'bg-danger/20 text-danger' :
                            'bg-gray-600 text-gray-300'
                          }`}>
                            {item.sentiment}
                          </span>
                          <span className="text-xs text-gray-400">{item.category}</span>
                          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                            {item.relevance}% relevant
                          </span>
                        </div>
                        <h4 className="font-semibold mb-1">{item.title}</h4>
                        <p className="text-sm text-gray-400 mb-2">{item.summary}</p>
                        <div className="text-xs text-gray-500">Source: {item.source}</div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                          <Clock className="w-3 h-3" />
                          {item.time}
                        </div>
                        {item.marketMove && (
                          <div className={`text-sm font-semibold ${
                            item.marketMove.startsWith('+') ? 'text-secondary' : 'text-danger'
                          }`}>
                            {item.marketMove}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {item.historicalPattern && (
                      <div className="bg-gray-800 rounded p-3 text-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="w-4 h-4 text-primary" />
                          <span className="font-medium">Historical Pattern</span>
                        </div>
                        <p className="text-gray-300">{item.historicalPattern}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {selectedIndex} Alerts
            </h3>
            
            <div className="space-y-3">
              <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <span className="text-sm font-semibold text-secondary">Strong Buy Signal</span>
                </div>
                <p className="text-xs text-gray-300">GDP beat + FII inflows combination detected</p>
              </div>
              
              <div className="bg-accent/10 border border-accent/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-sm font-semibold text-accent">Volatility Warning</span>
                </div>
                <p className="text-xs text-gray-300">Oil price spike may increase market volatility</p>
              </div>
              
              <div className="bg-gray-600/20 border border-gray-600 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-sm font-semibold text-gray-400">Monitoring</span>
                </div>
                <p className="text-xs text-gray-300">RBI policy impact assessment ongoing</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="font-semibold mb-4">Similar Historical Events</h3>
            
            <div className="space-y-3">
              {marketEvents.map((event, index) => (
                <div key={index} className="bg-gray-750 rounded-lg p-3 border border-gray-600">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400">{event.date}</span>
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                      {event.similarity} match
                    </span>
                  </div>
                  <p className="text-sm font-medium mb-1">{event.event}</p>
                  <div className={`text-sm font-semibold ${
                    event.marketReaction.startsWith('+') ? 'text-secondary' : 'text-danger'
                  }`}>
                    Market: {event.marketReaction}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="font-semibold mb-4">News Sources</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Times Now India</span>
                <span className="text-secondary">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Economic Times</span>
                <span className="text-secondary">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Google News</span>
                <span className="text-secondary">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Reuters India</span>
                <span className="text-secondary">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Bloomberg India</span>
                <span className="text-secondary">Active</span>
              </div>
            </div>
            
            <div className="mt-4 text-xs text-gray-400">
              Updates: Every hour from 8 AM to 4 PM
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsView;