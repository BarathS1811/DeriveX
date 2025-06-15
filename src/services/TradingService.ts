import { authService } from './AuthService';

export interface Order {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  orderType: 'MARKET' | 'LIMIT' | 'SL' | 'SL-M';
  status: 'Pending' | 'Executed' | 'Cancelled' | 'Rejected';
  timestamp: Date;
  stopLoss?: number;
  target1?: number;
  target2?: number;
  executedPrice?: number;
  executedQuantity?: number;
}

export interface Position {
  id: string;
  symbol: string;
  quantity: number;
  avgPrice: number;
  ltp: number;
  pnl: number;
  pnlPercent: number;
  status: 'Open' | 'Closed';
  stopLoss?: number;
  target1?: number;
  target2?: number;
  target1Hit?: boolean;
}

class TradingService {
  private orders: Order[] = [];
  private positions: Position[] = [];
  private orderIdCounter = 1;
  private positionIdCounter = 1;

  constructor() {
    this.loadData();
    this.startMarketMonitoring();
  }

  private loadData() {
    const savedOrders = localStorage.getItem('marketAI_orders');
    const savedPositions = localStorage.getItem('marketAI_positions');
    
    if (savedOrders) {
      this.orders = JSON.parse(savedOrders);
    }
    
    if (savedPositions) {
      this.positions = JSON.parse(savedPositions);
    }
  }

  private saveData() {
    localStorage.setItem('marketAI_orders', JSON.stringify(this.orders));
    localStorage.setItem('marketAI_positions', JSON.stringify(this.positions));
  }

  private startMarketMonitoring() {
    // Monitor positions for stop loss and target execution
    setInterval(() => {
      this.checkStopLossAndTargets();
    }, 5000); // Check every 5 seconds
  }

  private checkStopLossAndTargets() {
    this.positions.forEach(position => {
      if (position.status !== 'Open') return;

      const currentPrice = position.ltp;
      
      // Check stop loss
      if (position.stopLoss) {
        const shouldTriggerSL = position.quantity > 0 ? 
          currentPrice <= position.stopLoss : 
          currentPrice >= position.stopLoss;
          
        if (shouldTriggerSL) {
          this.executeStopLoss(position);
          return;
        }
      }

      // Check targets
      if (position.target1 && !position.target1Hit) {
        const target1Hit = position.quantity > 0 ? 
          currentPrice >= position.target1 : 
          currentPrice <= position.target1;
          
        if (target1Hit) {
          position.target1Hit = true;
          this.saveData();
        }
      }

      if (position.target2 && position.target1Hit) {
        const target2Hit = position.quantity > 0 ? 
          currentPrice >= position.target2 : 
          currentPrice <= position.target2;
          
        if (target2Hit) {
          this.executeTarget(position, 'target2');
          return;
        }
      }

      // Check if price falls below target1 after hitting it
      if (position.target1Hit && position.target1) {
        const fallsBelowTarget1 = position.quantity > 0 ? 
          currentPrice < position.target1 : 
          currentPrice > position.target1;
          
        if (fallsBelowTarget1) {
          this.executeTarget(position, 'target1');
          return;
        }
      }
    });
  }

  private executeStopLoss(position: Position) {
    const order: Order = {
      id: `SL_${Date.now()}`,
      symbol: position.symbol,
      type: position.quantity > 0 ? 'SELL' : 'BUY',
      quantity: Math.abs(position.quantity),
      price: position.stopLoss!,
      orderType: 'MARKET',
      status: 'Executed',
      timestamp: new Date(),
      executedPrice: position.stopLoss,
      executedQuantity: Math.abs(position.quantity)
    };

    this.orders.push(order);
    position.status = 'Closed';
    this.saveData();
  }

  private executeTarget(position: Position, targetType: 'target1' | 'target2') {
    const targetPrice = targetType === 'target1' ? position.target1! : position.target2!;
    
    const order: Order = {
      id: `TGT_${Date.now()}`,
      symbol: position.symbol,
      type: position.quantity > 0 ? 'SELL' : 'BUY',
      quantity: Math.abs(position.quantity),
      price: targetPrice,
      orderType: 'MARKET',
      status: 'Executed',
      timestamp: new Date(),
      executedPrice: targetPrice,
      executedQuantity: Math.abs(position.quantity)
    };

    this.orders.push(order);
    position.status = 'Closed';
    this.saveData();
  }

  placeOrder(orderData: Partial<Order>): { success: boolean; message: string; orderId?: string } {
    if (!authService.isLoggedIn()) {
      return { success: false, message: 'Please login to place orders' };
    }

    const user = authService.getCurrentUser();
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    // Calculate required margin
    const requiredMargin = (orderData.price! * orderData.quantity!) * 0.2; // 20% margin
    
    if (requiredMargin > user.wallet.availableMargin) {
      return { success: false, message: 'Insufficient margin' };
    }

    const order: Order = {
      id: `ORD${this.orderIdCounter++}`,
      symbol: orderData.symbol!,
      type: orderData.type!,
      quantity: orderData.quantity!,
      price: orderData.price!,
      orderType: orderData.orderType!,
      status: orderData.orderType === 'MARKET' ? 'Executed' : 'Pending',
      timestamp: new Date(),
      stopLoss: orderData.stopLoss,
      target1: orderData.target1,
      target2: orderData.target2
    };

    if (order.status === 'Executed') {
      order.executedPrice = order.price;
      order.executedQuantity = order.quantity;
      
      // Create position
      this.createOrUpdatePosition(order);
      
      // Update user margin
      authService.updateWallet({
        availableMargin: user.wallet.availableMargin - requiredMargin,
        usedMargin: user.wallet.usedMargin + requiredMargin
      });
    }

    this.orders.push(order);
    this.saveData();

    return { 
      success: true, 
      message: `Order placed successfully. Order ID: ${order.id}`,
      orderId: order.id
    };
  }

  private createOrUpdatePosition(order: Order) {
    const existingPosition = this.positions.find(p => 
      p.symbol === order.symbol && p.status === 'Open'
    );

    if (existingPosition) {
      // Update existing position
      const totalQuantity = existingPosition.quantity + (order.type === 'BUY' ? order.quantity : -order.quantity);
      const totalValue = (existingPosition.avgPrice * existingPosition.quantity) + 
                        (order.executedPrice! * (order.type === 'BUY' ? order.quantity : -order.quantity));
      
      existingPosition.quantity = totalQuantity;
      existingPosition.avgPrice = totalValue / totalQuantity;
      
      if (order.stopLoss) existingPosition.stopLoss = order.stopLoss;
      if (order.target1) existingPosition.target1 = order.target1;
      if (order.target2) existingPosition.target2 = order.target2;
    } else {
      // Create new position
      const position: Position = {
        id: `POS${this.positionIdCounter++}`,
        symbol: order.symbol,
        quantity: order.type === 'BUY' ? order.quantity : -order.quantity,
        avgPrice: order.executedPrice!,
        ltp: order.executedPrice!,
        pnl: 0,
        pnlPercent: 0,
        status: 'Open',
        stopLoss: order.stopLoss,
        target1: order.target1,
        target2: order.target2,
        target1Hit: false
      };

      this.positions.push(position);
    }
  }

  getOrders(): Order[] {
    return this.orders;
  }

  getPositions(): Position[] {
    return this.positions.filter(p => p.status === 'Open');
  }

  cancelOrder(orderId: string): { success: boolean; message: string } {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) {
      return { success: false, message: 'Order not found' };
    }

    if (order.status !== 'Pending') {
      return { success: false, message: 'Cannot cancel executed order' };
    }

    order.status = 'Cancelled';
    this.saveData();

    return { success: true, message: 'Order cancelled successfully' };
  }

  exitPosition(positionId: string): { success: boolean; message: string } {
    const position = this.positions.find(p => p.id === positionId);
    if (!position) {
      return { success: false, message: 'Position not found' };
    }

    const order: Order = {
      id: `EXIT_${Date.now()}`,
      symbol: position.symbol,
      type: position.quantity > 0 ? 'SELL' : 'BUY',
      quantity: Math.abs(position.quantity),
      price: position.ltp,
      orderType: 'MARKET',
      status: 'Executed',
      timestamp: new Date(),
      executedPrice: position.ltp,
      executedQuantity: Math.abs(position.quantity)
    };

    this.orders.push(order);
    position.status = 'Closed';
    this.saveData();

    return { success: true, message: 'Position closed successfully' };
  }

  updatePositionPrices(symbol: string, ltp: number) {
    this.positions.forEach(position => {
      if (position.symbol === symbol && position.status === 'Open') {
        position.ltp = ltp;
        position.pnl = (ltp - position.avgPrice) * position.quantity;
        position.pnlPercent = (position.pnl / (position.avgPrice * Math.abs(position.quantity))) * 100;
      }
    });
    this.saveData();
  }
}

export const tradingService = new TradingService();