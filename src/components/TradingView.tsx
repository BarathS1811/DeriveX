import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { tradingService, Order, Position } from '../services/TradingService';
import { authService } from '../services/AuthService';

const TradingView: React.FC = () => {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [orders, setOrders] = useState<Order[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setUser(authService.getCurrentUser());
      if (authService.isLoggedIn()) {
        setOrders(tradingService.getOrders());
        setPositions(tradingService.getPositions());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const cancelOrder = (orderId: string) => {
    const result = tradingService.cancelOrder(orderId);
    alert(result.message);
    if (result.success) {
      setOrders(tradingService.getOrders());
    }
  };

  const exitPosition = (positionId: string) => {
    const result = tradingService.exitPosition(positionId);
    alert(result.message);
    if (result.success) {
      setPositions(tradingService.getPositions());
      setOrders(tradingService.getOrders());
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please Login</h2>
          <p className="text-gray-400">You need to login to access trading features.</p>
        </div>
      </div>
    );
  }

  const totalPnL = positions.reduce((sum, pos) => sum + pos.pnl, 0);
  const totalInvested = positions.reduce((sum, pos) => sum + (pos.avgPrice * Math.abs(pos.quantity)), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Trading Terminal</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">
            <Clock className="w-4 h-4 inline mr-1" />
            Market: Open | 15:25:43
          </div>
          <div className={`text-sm font-semibold ${totalPnL >= 0 ? 'text-secondary' : 'text-danger'}`}>
            Total P&L: ₹{totalPnL.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Trading Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-primary" />
            <span className="text-sm text-gray-400">Available Balance</span>
          </div>
          <div className="text-2xl font-bold">₹{user.wallet.availableMargin.toLocaleString()}</div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-secondary" />
            <span className="text-sm text-gray-400">Used Margin</span>
          </div>
          <div className="text-2xl font-bold">₹{user.wallet.usedMargin.toLocaleString()}</div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            {totalPnL >= 0 ? (
              <TrendingUp className="w-5 h-5 text-secondary" />
            ) : (
              <TrendingDown className="w-5 h-5 text-danger" />
            )}
            <span className="text-sm text-gray-400">Total P&L</span>
          </div>
          <div className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-secondary' : 'text-danger'}`}>
            ₹{totalPnL.toLocaleString()}
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-accent" />
            <span className="text-sm text-gray-400">Open Positions</span>
          </div>
          <div className="text-2xl font-bold">{positions.length}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Open Positions */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold mb-4">Open Positions</h3>
          
          {positions.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No open positions
            </div>
          ) : (
            <div className="space-y-3">
              {positions.map((position) => (
                <div key={position.id} className="bg-gray-750 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{position.symbol}</h4>
                      <div className="text-sm text-gray-400">
                        Qty: {position.quantity} | Avg: ₹{position.avgPrice.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">LTP: ₹{position.ltp.toFixed(2)}</div>
                      <div className={`text-sm ${position.pnl >= 0 ? 'text-secondary' : 'text-danger'}`}>
                        P&L: ₹{position.pnl.toFixed(2)} ({position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%)
                      </div>
                    </div>
                  </div>
                  
                  {(position.stopLoss || position.target1 || position.target2) && (
                    <div className="text-xs text-gray-400 mb-2">
                      {position.stopLoss && <span>SL: ₹{position.stopLoss.toFixed(2)} </span>}
                      {position.target1 && <span>T1: ₹{position.target1.toFixed(2)} </span>}
                      {position.target2 && <span>T2: ₹{position.target2.toFixed(2)} </span>}
                      {position.target1Hit && <span className="text-secondary">(T1 Hit)</span>}
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => exitPosition(position.id)}
                      className="bg-danger hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Exit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Book */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold mb-4">Order Book</h3>
          
          {orders.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No orders placed
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {orders.slice().reverse().map((order) => (
                <div key={order.id} className="bg-gray-750 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{order.symbol}</h4>
                      <div className="text-sm text-gray-400">
                        {order.type} | Qty: {order.quantity} | {order.orderType}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">₹{order.price.toFixed(2)}</div>
                      <div className="text-sm text-gray-400">{order.timestamp.toLocaleTimeString()}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-2 text-sm ${
                      order.status === 'Executed' ? 'text-secondary' :
                      order.status === 'Pending' ? 'text-accent' : 
                      order.status === 'Cancelled' ? 'text-gray-400' : 'text-danger'
                    }`}>
                      {order.status === 'Executed' && <CheckCircle className="w-4 h-4" />}
                      {order.status === 'Pending' && <Clock className="w-4 h-4" />}
                      {order.status === 'Rejected' && <AlertTriangle className="w-4 h-4" />}
                      {order.status}
                    </div>
                    
                    {order.status === 'Pending' && (
                      <button 
                        onClick={() => cancelOrder(order.id)}
                        className="bg-danger hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Trading Statistics */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-semibold mb-4">Trading Statistics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-750 rounded-lg p-4 text-center">
            <div className="text-sm text-gray-400">Total Orders</div>
            <div className="text-2xl font-bold">{orders.length}</div>
          </div>
          
          <div className="bg-gray-750 rounded-lg p-4 text-center">
            <div className="text-sm text-gray-400">Executed Orders</div>
            <div className="text-2xl font-bold text-secondary">
              {orders.filter(o => o.status === 'Executed').length}
            </div>
          </div>
          
          <div className="bg-gray-750 rounded-lg p-4 text-center">
            <div className="text-sm text-gray-400">Pending Orders</div>
            <div className="text-2xl font-bold text-accent">
              {orders.filter(o => o.status === 'Pending').length}
            </div>
          </div>
          
          <div className="bg-gray-750 rounded-lg p-4 text-center">
            <div className="text-sm text-gray-400">Success Rate</div>
            <div className="text-2xl font-bold">
              {orders.length > 0 ? 
                Math.round((orders.filter(o => o.status === 'Executed').length / orders.length) * 100) : 0
              }%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingView;