import React from 'react';
import IndexOverview from './IndexOverview';
import ContributorAnalysis from './ContributorAnalysis';
import MarketSentiment from './MarketSentiment';
import TopMovers from './TopMovers';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Market Dashboard</h2>
        <div className="flex items-center gap-4">
          <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            Refresh Data
          </button>
          <div className="text-sm text-gray-400">
            Last updated: 2 minutes ago
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