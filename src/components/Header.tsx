import React from 'react';
import { Bell, Search, User, Wifi } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Wifi className="w-4 h-4 text-secondary" />
            <span className="text-secondary">Live Data</span>
            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
          </div>
          <div className="text-sm text-gray-400">
            Market: <span className="text-secondary">Open</span> | 
            NIFTY: <span className="text-secondary">19,245.30</span> | 
            Time: <span className="text-white">15:25:43</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search indices, derivatives..."
              className="bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary"
            />
          </div>
          
          <button className="relative p-2 hover:bg-gray-700 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <div className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></div>
          </button>
          
          <div className="flex items-center gap-2 bg-gray-700 rounded-lg px-3 py-2">
            <User className="w-4 h-4" />
            <span className="text-sm">Trading Desk</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;