import axios from 'axios';

export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: Date;
  ohlc?: {
    open: number;
    high: number;
    low: number;
    close: number;
  };
}

export interface CandlestickData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

class DataService {
  private apiKey: string | null = null;
  private apiSecret: string | null = null;
  private provider: string = 'NSEpy';
  private lastUpdate: Date = new Date();

  setAPICredentials(provider: string, apiKey: string, apiSecret?: string) {
    this.provider = provider;
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
  }

  getDataTimestamp(): Date {
    return this.lastUpdate;
  }

  isLiveData(): boolean {
    return this.apiKey !== null && this.provider !== 'NSEpy';
  }

  // NSEpy simulation - in production, this would call actual NSEpy endpoints
  private async fetchNSEpyData(symbol: string): Promise<MarketData> {
    // Simulate NSEpy API call with 15-minute delay
    const delayedTime = new Date(Date.now() - 15 * 60 * 1000);
    
    // Mock data generation
    const basePrice = symbol === 'NIFTY50' ? 19200 : 44500;
    const price = basePrice + (Math.random() - 0.5) * 500;
    const change = (Math.random() - 0.5) * 200;
    
    return {
      symbol,
      price,
      change,
      changePercent: (change / (price - change)) * 100,
      volume: Math.random() * 2000000000,
      timestamp: delayedTime,
      ohlc: {
        open: price - 50,
        high: price + 30,
        low: price - 80,
        close: price
      }
    };
  }

  // Live API data fetch
  private async fetchLiveData(symbol: string): Promise<MarketData> {
    if (!this.apiKey) {
      throw new Error('API credentials not configured');
    }

    // This would integrate with actual broker APIs
    // For now, simulating live data
    const price = symbol === 'NIFTY50' ? 19245.30 : 44682.15;
    const change = (Math.random() - 0.5) * 200;
    
    return {
      symbol,
      price,
      change,
      changePercent: (change / (price - change)) * 100,
      volume: Math.random() * 2000000000,
      timestamp: new Date(),
      ohlc: {
        open: price - 50,
        high: price + 30,
        low: price - 80,
        close: price
      }
    };
  }

  async getMarketData(symbol: string): Promise<MarketData> {
    this.lastUpdate = new Date();
    
    if (this.isLiveData()) {
      return await this.fetchLiveData(symbol);
    } else {
      return await this.fetchNSEpyData(symbol);
    }
  }

  async getCandlestickData(symbol: string, timeframe: string = '1m', count: number = 100): Promise<CandlestickData[]> {
    // Generate mock candlestick data
    const data: CandlestickData[] = [];
    const basePrice = symbol === 'NIFTY50' ? 19200 : 44500;
    
    for (let i = count; i >= 0; i--) {
      const time = new Date(Date.now() - i * this.getTimeframeMs(timeframe));
      const open = basePrice + (Math.random() - 0.5) * 200;
      const close = open + (Math.random() - 0.5) * 50;
      const high = Math.max(open, close) + Math.random() * 20;
      const low = Math.min(open, close) - Math.random() * 20;
      
      data.push({
        time: time.toISOString(),
        open,
        high,
        low,
        close,
        volume: Math.random() * 1000000
      });
    }
    
    return data;
  }

  private getTimeframeMs(timeframe: string): number {
    const timeframes: { [key: string]: number } = {
      '1m': 60 * 1000,
      '5m': 5 * 60 * 1000,
      '15m': 15 * 60 * 1000,
      '1h': 60 * 60 * 1000,
      '1d': 24 * 60 * 60 * 1000
    };
    return timeframes[timeframe] || 60 * 1000;
  }

  async getIndexConstituents(index: string): Promise<any[]> {
    // Mock data for index constituents
    const nifty50Stocks = [
      { symbol: 'RELIANCE', weight: 10.8, price: 2456.75, change: 2.3, changePercent: 0.94 },
      { symbol: 'TCS', weight: 9.2, price: 3678.90, change: 1.8, changePercent: 0.49 },
      { symbol: 'HDFCBANK', weight: 8.7, price: 1645.20, change: -0.5, changePercent: -0.03 },
      { symbol: 'INFY', weight: 7.1, price: 1456.80, change: 2.1, changePercent: 1.44 },
      { symbol: 'ICICIBANK', weight: 6.8, price: 987.65, change: -1.2, changePercent: -0.12 },
      { symbol: 'HINDUNILVR', weight: 4.2, price: 2345.60, change: 0.8, changePercent: 0.34 },
      { symbol: 'ITC', weight: 3.9, price: 456.75, change: -0.3, changePercent: -0.07 },
      { symbol: 'SBIN', weight: 3.5, price: 567.80, change: 1.5, changePercent: 0.26 },
      { symbol: 'BHARTIARTL', weight: 3.2, price: 876.45, change: 0.9, changePercent: 0.10 },
      { symbol: 'KOTAKBANK', weight: 3.0, price: 1789.30, change: -0.7, changePercent: -0.04 }
    ];

    const bankNiftyStocks = [
      { symbol: 'HDFCBANK', weight: 15.2, price: 1645.20, change: -1.8, changePercent: -0.11 },
      { symbol: 'ICICIBANK', weight: 13.4, price: 987.65, change: -1.2, changePercent: -0.12 },
      { symbol: 'KOTAKBANK', weight: 12.5, price: 1789.30, change: 1.5, changePercent: 0.84 },
      { symbol: 'SBIN', weight: 11.7, price: 567.80, change: -2.1, changePercent: -0.37 },
      { symbol: 'AXISBANK', weight: 9.8, price: 1123.45, change: 0.8, changePercent: 0.07 },
      { symbol: 'INDUSINDBK', weight: 8.3, price: 1345.67, change: 1.2, changePercent: 0.09 },
      { symbol: 'AUBANK', weight: 6.2, price: 678.90, change: 0.5, changePercent: 0.07 },
      { symbol: 'BANDHANBNK', weight: 4.8, price: 234.56, change: -0.8, changePercent: -0.34 },
      { symbol: 'FEDERALBNK', weight: 3.9, price: 145.67, change: 0.3, changePercent: 0.21 },
      { symbol: 'IDFCFIRSTB', weight: 3.2, price: 89.45, change: -0.2, changePercent: -0.22 }
    ];

    return index === 'NIFTY50' ? nifty50Stocks : bankNiftyStocks;
  }
}

export const dataService = new DataService();