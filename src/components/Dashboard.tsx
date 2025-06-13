import React, { useState, useEffect } from 'react';
import IndexOverview from './IndexOverview';
import ContributorAnalysis from './ContributorAnalysis';
import MarketSentiment from './MarketSentiment';
import TopMovers from './TopMovers';

const Dashboard: React.FC = () => {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsUpdating(true);
      // Auto-refresh every 30 seconds - will integrate with user API
      setTimeout(() => {
        setLastUpdated(new Date());
        setIsUpdating(false);
      }, 1000);
    }, 30000); // Auto-refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Market Dashboard</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {isUpdating && (
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            )}
            <div className="text-sm text-gray-400">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
      
      <IndexOverview />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ContributorAnalysis />
        <MarketSentiment />
      </div>
      
      <TopMovers />
    </div>
  );
};

export default Dashboard;