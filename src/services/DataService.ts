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
  private nsepyData: { [key: string]: any } = {};

  constructor() {
    this.initializeNSEpy();
  }

  private async initializeNSEpy() {
    // Simulate NSEpy initialization and data fetching
    try {
      // In a real implementation, this would use Python subprocess or API calls
      await this.fetchNSEpyData();
      setInterval(() => this.fetchNSEpyData(), 60000); // Update every minute
    } catch (error) {
      console.error('NSEpy initialization failed:', error);
    }
  }

  private async fetchNSEpyData() {
    // Simulate NSEpy data fetching with 15-minute delay
    const delayedTime = new Date(Date.now() - 15 * 60 * 1000);
    
    // Mock NSEpy data structure
    this.nsepyData = {
      'NIFTY50': {
        price: 19245.30 + (Math.random() - 0.5) * 100,
        change: (Math.random() - 0.5) * 200,
        volume: Math.random() * 2000000000,
        timestamp: delayedTime,
        ohlc: {
          open: 19200 + (Math.random() - 0.5) * 50,
          high: 19300 + Math.random() * 30,
          low: 19150 - Math.random() * 30,
          close: 19245.30 + (Math.random() - 0.5) * 100
        }
      },
      'BANKNIFTY': {
        price: 44682.15 + (Math.random() - 0.5) * 200,
        change: (Math.random() - 0.5) * 300,
        volume: Math.random() * 1500000000,
        timestamp: delayedTime,
        ohlc: {
          open: 44500 + (Math.random() - 0.5) * 100,
          high: 44800 + Math.random() * 50,
          low: 44400 - Math.random() * 50,
          close: 44682.15 + (Math.random() - 0.5) * 200
        }
      }
    };
  }

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

  private async fetchHDFCSkyData(symbol: string): Promise<MarketData> {
    if (!this.apiKey) {
      throw new Error('HDFC Sky API credentials not configured');
    }

    try {
      // Simulate HDFC Sky API call
      const response = await axios.get(`https://api.hdfcsky.com/market/quote`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        params: {
          symbol: symbol,
          exchange: 'NSE'
        }
      });

      const data = response.data;
      return {
        symbol,
        price: data.ltp,
        change: data.change,
        changePercent: data.changePercent,
        volume: data.volume,
        timestamp: new Date(),
        ohlc: {
          open: data.open,
          high: data.high,
          low: data.low,
          close: data.ltp
        }
      };
    } catch (error) {
      console.error('HDFC Sky API error:', error);
      // Fallback to NSEpy data
      return this.fetchNSEpyMarketData(symbol);
    }
  }

  private async fetchNSEpyMarketData(symbol: string): Promise<MarketData> {
    const nsepySymbolData = this.nsepyData[symbol];
    if (!nsepySymbolData) {
      throw new Error(`No NSEpy data available for ${symbol}`);
    }

    return {
      symbol,
      price: nsepySymbolData.price,
      change: nsepySymbolData.change,
      changePercent: (nsepySymbolData.change / (nsepySymbolData.price - nsepySymbolData.change)) * 100,
      volume: nsepySymbolData.volume,
      timestamp: nsepySymbolData.timestamp,
      ohlc: nsepySymbolData.ohlc
    };
  }

  async getMarketData(symbol: string): Promise<MarketData> {
    this.lastUpdate = new Date();
    
    if (this.provider === 'HDFC Sky' && this.apiKey) {
      return await this.fetchHDFCSkyData(symbol);
    } else {
      return await this.fetchNSEpyMarketData(symbol);
    }
  }

  async getCandlestickData(symbol: string, timeframe: string = '1m', count: number = 100): Promise<CandlestickData[]> {
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
      '30m': 30 * 60 * 1000,
      '1h': 60 * 60 * 1000,
      '2h': 2 * 60 * 60 * 1000,
      '4h': 4 * 60 * 60 * 1000,
      '1d': 24 * 60 * 60 * 1000,
      '1w': 7 * 24 * 60 * 60 * 1000
    };
    return timeframes[timeframe] || 60 * 1000;
  }

  async getIndexConstituents(index: string): Promise<any[]> {
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