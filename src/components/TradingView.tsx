import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

const TradingView: React.FC = () => {
  const [selectedOrderType, setSelectedOrderType] = useState('BUY');
  const [selectedInstrument, setSelectedInstrument] = useState('NIFTY50-CE-19300');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(125.50);
  const [orderType, setOrderType] = useState('LIMIT');

  const [positions] = useState([
    {
      id: 1,
      symbol: 'NIFTY50-CE-19300',
      type: 'Call',
      quantity: 50,
      avgPrice: 120.25,
      ltp: 125.50,
      pnl: 262.50,
      pnlPercent: 4.36,
      status: 'Open'
    },
    {
      id: 2,
      symbol: 'BANKNIFTY-PE-44500',
      type: 'Put',
      quantity: -25,
      avgPrice: 89.75,
      ltp: 85.30,
      pnl: 111.25,
      pnlPercent: 4.96,
      status: 'Open'
    }
  ]);

  const [orders] = useState([
    {
      id: 1,
      symbol: 'NIFTY50-CE-19400',
      type: 'BUY',
      quantity: 25,
      price: 76.25,
      orderType: 'LIMIT',
      status: 'Pending',
      time: '10:30:45'
    },
    {
      id: 2,
      symbol: 'BANKNIFTY-CE-45000',
      type: 'SELL',
      quantity: 50,
      price: 45.80,
      orderType: 'MARKET',
      status: 'Executed',
      time: '10:25:12'
    }
  ]);

  const instruments = [
    'NIFTY50-CE-19300',
    'NIFTY50-PE-19300',
    'NIFTY50-CE-19400',
    'BANKNIFTY-CE-44500',
    'BANKNIFTY-PE-44500'
  ];

  const placeOrder = () => {
    const orderDetails = {
      instrument: selectedInstrument,
      type: selectedOrderType,
      quantity,
      price: orderType === 'MARKET' ? 'Market Price' : price,
      orderType
    };

    alert(`Order Placed Successfully!

Instrument: ${orderDetails.instrument}
Type: ${orderDetails.type}
Quantity: ${orderDetails.quantity}
Price: ${orderDetails.price}
Order Type: ${orderDetails.orderType}

Order ID: ORD${Date.now()}`);
  };

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Placement */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Place Order
          </h3>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedOrderType('BUY')}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                  selectedOrderType === 'BUY'
                    ? 'bg-secondary text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                BUY
              </button>
              <button
                onClick={() => setSelectedOrderType('SELL')}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                  selectedOrderType === 'SELL'
                    ? 'bg-danger text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                SELL
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Instrument
              </label>
              <select
                value={selectedInstrument}
                onChange={(e) => setSelectedInstrument(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm"
              >
                {instruments.map(instrument => (
                  <option key={instrument} value={instrument}>{instrument}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Quantity
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Order Type
              </label>
              <select
                value={orderType}
                onChange={(e) => setOrderType(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm"
              >
                <option value="LIMIT">LIMIT</option>
                <option value="MARKET">MARKET</option>
                <option value="SL">STOP LOSS</option>
                <option value="SL-M">SL-MARKET</option>
              </select>
            </div>

            {orderType !== 'MARKET' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Price
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            )}

            <button
              onClick={placeOrder}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                selectedOrderType === 'BUY'
                  ? 'bg-secondary hover:bg-green-600 text-white'
                  : 'bg-danger hover:bg-red-600 text-white'
              }`}
            >
              {selectedOrderType} {selectedInstrument}
            </button>
          </div>
        </div>

        {/* Positions */}
        <div className="lg:col-span-2 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold mb-4">Open Positions</h3>
          
          <div className="space-y-3">
            {positions.map((position) => (
              <div key={position.id} className="bg-gray-750 rounded-lg p-4 border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">{position.symbol}</h4>
                    <div className="text-sm text-gray-400">
                      {position.type} | Qty: {position.quantity} | Avg: ₹{position.avgPrice}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">LTP: ₹{position.ltp}</div>
                    <div className={`text-sm ${position.pnl >= 0 ? 'text-secondary' : 'text-danger'}`}>
                      P&L: ₹{position.pnl.toFixed(2)} ({position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%)
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button className="bg-danger hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
                    Exit
                  </button>
                  <button className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm">
                    Modify
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Orders and Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Book */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold mb-4">Order Book</h3>
          
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="bg-gray-750 rounded-lg p-4 border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">{order.symbol}</h4>
                    <div className="text-sm text-gray-400">
                      {order.type} | Qty: {order.quantity} | {order.orderType}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">₹{order.price}</div>
                    <div className="text-sm text-gray-400">{order.time}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-2 text-sm ${
                    order.status === 'Executed' ? 'text-secondary' :
                    order.status === 'Pending' ? 'text-accent' : 'text-danger'
                  }`}>
                    {order.status === 'Executed' && <CheckCircle className="w-4 h-4" />}
                    {order.status === 'Pending' && <Clock className="w-4 h-4" />}
                    {order.status === 'Rejected' && <AlertTriangle className="w-4 h-4" />}
                    {order.status}
                  </div>
                  
                  {order.status === 'Pending' && (
                    <button className="bg-danger hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trading Summary */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold mb-4">Trading Summary</h3>
          
          <div className="space-y-4">
            <div className="bg-gray-750 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Total Invested</span>
                <span className="font-semibold">₹{totalInvested.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Current Value</span>
                <span className="font-semibold">₹{(totalInvested + totalPnL).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Total P&L</span>
                <span className={`font-semibold ${totalPnL >= 0 ? 'text-secondary' : 'text-danger'}`}>
                  ₹{totalPnL.toFixed(2)} ({((totalPnL / totalInvested) * 100).toFixed(2)}%)
                </span>
              </div>
            </div>

            <div className="bg-gray-750 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Today's Stats</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Trades</span>
                  <span>5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Winning Trades</span>
                  <span className="text-secondary">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Losing Trades</span>
                  <span className="text-danger">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Win Rate</span>
                  <span>60%</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-750 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Risk Metrics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Available Margin</span>
                  <span>₹1,25,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Used Margin</span>
                  <span>₹45,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Daily Loss Limit</span>
                  <span>₹50,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Current Exposure</span>
                  <span>36%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingView;