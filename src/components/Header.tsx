import React, { useState, useEffect } from 'react';
import { Bell, Search, User, Wifi, LogOut, Wallet, Plus, Minus } from 'lucide-react';
import { authService } from '../services/AuthService';

const Header: React.FC = () => {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletAction, setWalletAction] = useState<'add' | 'withdraw'>('add');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setUser(authService.getCurrentUser());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setShowUserMenu(false);
    window.location.reload();
  };

  const handleWalletAction = () => {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const result = walletAction === 'add' ? 
      authService.addMoney(amountNum) : 
      authService.withdrawMoney(amountNum);

    alert(result.message);
    
    if (result.success) {
      setAmount('');
      setShowWalletModal(false);
      setUser(authService.getCurrentUser());
    }
  };

  return (
    <>
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

            {user && (
              <button
                onClick={() => setShowWalletModal(true)}
                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 rounded-lg px-3 py-2 transition-colors"
              >
                <Wallet className="w-4 h-4" />
                <span className="text-sm">₹{user.wallet.balance.toLocaleString()}</span>
              </button>
            )}
            
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 bg-gray-700 rounded-lg px-3 py-2 hover:bg-gray-600 transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="text-sm">
                  {user ? user.username : 'Trading Desk'}
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50">
                  {user ? (
                    <>
                      <div className="p-3 border-b border-gray-600">
                        <div className="text-sm font-semibold">{user.username}</div>
                        <div className="text-xs text-gray-400">{user.email}</div>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-700 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <div className="p-3">
                      <div className="text-sm text-gray-400">Please login to access trading features</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Wallet Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-96 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Wallet Management</h3>
            
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setWalletAction('add')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors ${
                  walletAction === 'add' ? 'bg-secondary text-white' : 'bg-gray-700 text-gray-300'
                }`}
              >
                <Plus className="w-4 h-4" />
                Add Money
              </button>
              <button
                onClick={() => setWalletAction('withdraw')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors ${
                  walletAction === 'withdraw' ? 'bg-danger text-white' : 'bg-gray-700 text-gray-300'
                }`}
              >
                <Minus className="w-4 h-4" />
                Withdraw
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Amount (₹)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>

            {user && (
              <div className="bg-gray-750 rounded-lg p-3 mb-4 text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">Current Balance:</span>
                  <span>₹{user.wallet.balance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">Available Margin:</span>
                  <span>₹{user.wallet.availableMargin.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Used Margin:</span>
                  <span>₹{user.wallet.usedMargin.toLocaleString()}</span>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setShowWalletModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleWalletAction}
                className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                  walletAction === 'add' 
                    ? 'bg-secondary hover:bg-green-600 text-white'
                    : 'bg-danger hover:bg-red-600 text-white'
                }`}
              >
                {walletAction === 'add' ? 'Add Money' : 'Withdraw'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;