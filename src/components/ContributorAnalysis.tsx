import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ContributorAnalysis: React.FC = () => {
  const majorContributors = [
    { name: 'RELIANCE', impact: 15.2, change: 2.3, weight: 10.8 },
    { name: 'TCS', impact: 12.8, change: 1.8, weight: 9.2 },
    { name: 'HDFCBANK', impact: 11.5, change: -0.5, weight: 8.7 },
    { name: 'INFY', impact: 9.3, change: 2.1, weight: 7.1 },
    { name: 'ICICIBANK', impact: 8.7, change: 1.2, weight: 6.8 },
  ];

  const data = majorContributors.map(contributor => ({
    name: contributor.name,
    impact: contributor.impact,
    change: contributor.change,
  }));

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Major Contributors (70%)</h3>
        <div className="text-sm text-gray-400">Impact Analysis</div>
      </div>
      
      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
            <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #4B5563',
                borderRadius: '8px'
              }} 
            />
            <Bar dataKey="impact" fill="#0EA5E9" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="space-y-2">
        {majorContributors.map((contributor) => (
          <div key={contributor.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>{contributor.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-400">Weight: {contributor.weight}%</span>
              <span className={`${contributor.change >= 0 ? 'text-secondary' : 'text-danger'}`}>
                {contributor.change >= 0 ? '+' : ''}{contributor.change}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContributorAnalysis;