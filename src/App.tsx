import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ChartsView from './components/ChartsView';
import DerivativesView from './components/DerivativesView';
import AnalysisView from './components/AnalysisView';
import NewsView from './components/NewsView';
import SettingsView from './components/SettingsView';
import TradingView from './components/TradingView';
import PortfolioView from './components/PortfolioView';
import LoginModal from './components/LoginModal';
import { authService } from './services/AuthService';

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState(authService.getCurrentUser());

  useEffect(() => {
    const interval = setInterval(() => {
      setUser(authService.getCurrentUser());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Show login modal for trading-related views if user is not logged in
    if (['trading', 'portfolio', 'settings'].includes(activeView) && !user) {
      setShowLoginModal(true);
    }
  }, [activeView, user]);

  const handleLogin = () => {
    setUser(authService.getCurrentUser());
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'charts':
        return <ChartsView />;
      case 'derivatives':
        return <DerivativesView />;
      case 'analysis':
        return <AnalysisView />;
      case 'news':
        return <NewsView />;
      case 'trading':
        return <TradingView />;
      case 'portfolio':
        return <PortfolioView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          {renderActiveView()}
        </main>
      </div>
      
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}

export default App;