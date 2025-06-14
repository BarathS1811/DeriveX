import React, { useState, useEffect } from 'react';
import { dataService } from '../services/DataService';
import { TrendingUp, TrendingDown, Clock } from 'lucide-react';
import MarketSentiment from './MarketSentiment';
import TopMovers from './TopMovers';

const Dashboard: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<string | null>(null);
  const [marketData, setMarketData] = useState<any>({});
  const [indexConstituents, setIndexConstituents] = useState<any[]>([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [dataTimestamp, setDataTimestamp] = useState(new Date());
  const [isLiveData, setIsLiveData] = useState(false);

  const indices = [
    { name: 'NIFTY50', displayName: 'NIFTY 50' },
    { name: 'BANKNIFTY', displayName: 'BANK NIFTY' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const niftyData = await dataService.getMarketData('NIFTY50');
        const bankNiftyData = await dataService.getMarketData('BANKNIFTY');
        
        setMarketData({
          NIFTY50: niftyData,
          BANKNIFTY: bankNiftyData
        });
        
        setDataTimestamp(dataService.getDataTimestamp());
        setIsLiveData(dataService.isLiveData());
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Error fetching market data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Auto-refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedIndex) {
      const fetchConstituents = async () => {
        try {
          const constituents = await dataService.getIndexConstituents(selectedIndex);
          setIndexConstituents(constituents);
        } catch (error) {
          console.error('Error fetching constituents:', error);
        }
      };
      fetchConstituents();
    }
  }, [selectedIndex]);

  const calculateContributorImpact = (constituents: any[]) => {
    const majorContributors = constituents.filter(stock => stock.weight >= 3.0);
    const minorContributors = constituents.filter(stock => stock.weight < 3.0);
    
    const majorImpact = majorContributors.reduce((sum, stock) => 
      sum + (stock.changePercent * stock.weight / 100), 0);
    const minorImpact = minorContributors.reduce((sum, stock) => 
      sum + (stock.changePercent * stock.weight / 100), 0);
    
    return {
      major: { contributors: majorContributors, impact: majorImpact },
      minor: { contributors: minorContributors, impact: minorImpact },
      overall: majorImpact + minorImpact
    };
  };

  const contributorAnalysis = selectedIndex ? calculateContributorImpact(indexConstituents) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Market Dashboard</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <div className="text-sm text-gray-400">
              {isLiveData ? 'Live Data' : 'Delayed Data'} - {dataTimestamp.toLocaleString()}
            </div>
          </div>
          <div className="text-sm text-gray-400">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>
      </div>
      
      {/* Main Indices Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {indices.map((index) => {
          const data = marketData[index.name];
          if (!data) return null;

          return (
            <div 
              key={index.name}
              className={`bg-gray-800 rounded-xl p-6 border cursor-pointer transition-all ${
                selectedIndex === index.name 
                  ? 'border-primary shadow-lg shadow-primary/20' 
                  : 'border-gray-700 hover:border-gray-600'
              }`}
              onClick={() => setSelectedIndex(selectedIndex === index.name ? null : index.name)}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-semibold">{index.displayName}</h3>
                {data.change >= 0 ? (
                  <TrendingUp className="w-6 h-6 text-secondary" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-danger" />
                )}
              </div>
              
              <div className="text-3xl font-bold mb-2">
                {data.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </div>
              
              <div className="flex items-center gap-2 text-lg">
                <span className={`flex items-center gap-1 ${
                  data.change >= 0 ? 'text-secondary' : 'text-danger'
                }`}>
                  {data.change >= 0 ? '+' : ''}{data.change.toFixed(2)}
                  ({data.changePercent >= 0 ? '+' : ''}{data.changePercent.toFixed(2)}%)
                </span>
              </div>
              
              <div className="text-sm text-gray-400 mt-2">
                Volume: {(data.volume / 1000000000).toFixed(2)}B
              </div>
            </div>
          );
        })}
      </div>

      {/* Market Sentiment for each index */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MarketSentiment indexName="NIFTY50" />
        <MarketSentiment indexName="BANKNIFTY" />
      </div>

      {/* Selected Index Analysis */}
      {selectedIndex && contributorAnalysis && (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold">{selectedIndex} Detailed Analysis</h3>
          
          {/* Contributor Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Major Contributors (70%) */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h4 className="text-xl font-semibold mb-4">
                Major Contributors (70% Impact)
              </h4>
              <div className="space-y-3">
                {contributorAnalysis.major.contributors.slice(0, 5).map((stock) => (
                  <div key={stock.symbol} className="flex items-center justify-between bg-gray-750 rounded-lg p-3">
                    <div>
                      <div className="font-semibold">{stock.symbol}</div>
                      <div className="text-sm text-gray-400">Weight: {stock.weight}%</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">₹{stock.price.toFixed(2)}</div>
                      <div className={`text-sm ${
                        stock.changePercent >= 0 ? 'text-secondary' : 'text-danger'
                      }`}>
                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
                <div className="border-t border-gray-600 pt-3">
                  <div className="flex items-center justify-between font-semibold">
                    <span>Major Impact:</span>
                    <span className={contributorAnalysis.major.impact >= 0 ? 'text-secondary' : 'text-danger'}>
                      {contributorAnalysis.major.impact >= 0 ? '+' : ''}{contributorAnalysis.major.impact.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Minor Contributors (30%) */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h4 className="text-xl font-semibold mb-4">
                Minor Contributors (30% Impact)
              </h4>
              <div className="space-y-3">
                {contributorAnalysis.minor.contributors.slice(0, 5).map((stock) => (
                  <div key={stock.symbol} className="flex items-center justify-between bg-gray-750 rounded-lg p-3">
                    <div>
                      <div className="font-semibold">{stock.symbol}</div>
                      <div className="text-sm text-gray-400">Weight: {stock.weight}%</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">₹{stock.price.toFixed(2)}</div>
                      <div className={`text-sm ${
                        stock.changePercent >= 0 ? 'text-secondary' : 'text-danger'
                      }`}>
                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
                <div className="border-t border-gray-600 pt-3">
                  <div className="flex items-center justify-between font-semibold">
                    <span>Minor Impact:</span>
                    <span className={contributorAnalysis.minor.impact >= 0 ? 'text-secondary' : 'text-danger'}>
                      {contributorAnalysis.minor.impact >= 0 ? '+' : ''}{contributorAnalysis.minor.impact.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Overall Impact */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h4 className="text-xl font-semibold mb-4">Overall Impact Analysis</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-750 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-400">Major Contributors</div>
                <div className={`text-2xl font-bold ${
                  contributorAnalysis.major.impact >= 0 ? 'text-secondary' : 'text-danger'
                }`}>
                  {contributorAnalysis.major.impact >= 0 ? '+' : ''}{contributorAnalysis.major.impact.toFixed(2)}%
                </div>
              </div>
              <div className="bg-gray-750 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-400">Minor Contributors</div>
                <div className={`text-2xl font-bold ${
                  contributorAnalysis.minor.impact >= 0 ? 'text-secondary' : 'text-danger'
                }`}>
                  {contributorAnalysis.minor.impact >= 0 ? '+' : ''}{contributorAnalysis.minor.impact.toFixed(2)}%
                </div>
              </div>
              <div className="bg-gray-750 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-400">Net Impact</div>
                <div className={`text-2xl font-bold ${
                  contributorAnalysis.overall >= 0 ? 'text-secondary' : 'text-danger'
                }`}>
                  {contributorAnalysis.overall >= 0 ? '+' : ''}{contributorAnalysis.overall.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>

          {/* Top Movers for selected index */}
          <TopMovers indexName={selectedIndex} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;