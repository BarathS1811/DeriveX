export interface IndicatorSettings {
  [key: string]: any;
}

export interface IndicatorResult {
  name: string;
  values: number[];
  signals?: string[];
  levels?: { [key: string]: number[] };
}

export class TechnicalIndicators {
  static calculateCPR(data: any[], settings: IndicatorSettings = { period: 1 }): IndicatorResult {
    const results: number[] = [];
    const levels: { [key: string]: number[] } = {
      pivot: [],
      r1: [],
      r2: [],
      s1: [],
      s2: []
    };

    data.forEach((candle) => {
      const high = candle.high;
      const low = candle.low;
      const close = candle.close;
      
      const pivot = (high + low + close) / 3;
      const r1 = 2 * pivot - low;
      const r2 = pivot + (high - low);
      const s1 = 2 * pivot - high;
      const s2 = pivot - (high - low);
      
      results.push(pivot);
      levels.pivot.push(pivot);
      levels.r1.push(r1);
      levels.r2.push(r2);
      levels.s1.push(s1);
      levels.s2.push(s2);
    });

    return {
      name: 'CPR',
      values: results,
      levels
    };
  }

  static calculateSupertrend(data: any[], settings: IndicatorSettings = { period: 10, multiplier: 3 }): IndicatorResult {
    const { period, multiplier } = settings;
    const results: number[] = [];
    const signals: string[] = [];
    
    // Calculate ATR first
    const atr = this.calculateATR(data, period);
    
    data.forEach((candle, index) => {
      if (index < period) {
        results.push(0);
        signals.push('');
        return;
      }
      
      const hl2 = (candle.high + candle.low) / 2;
      const atrValue = atr.values[index] || 0;
      
      const upperBand = hl2 + (multiplier * atrValue);
      const lowerBand = hl2 - (multiplier * atrValue);
      
      // Simplified supertrend calculation
      const prevClose = data[index - 1]?.close || candle.close;
      const supertrend = candle.close > prevClose ? lowerBand : upperBand;
      
      results.push(supertrend);
      signals.push(candle.close > supertrend ? 'BUY' : 'SELL');
    });

    return {
      name: 'Supertrend',
      values: results,
      signals
    };
  }

  static calculateVWAP(data: any[], settings: IndicatorSettings = { period: 14 }): IndicatorResult {
    const results: number[] = [];
    let cumulativeTPV = 0;
    let cumulativeVolume = 0;

    data.forEach((candle) => {
      const typicalPrice = (candle.high + candle.low + candle.close) / 3;
      const tpv = typicalPrice * candle.volume;
      
      cumulativeTPV += tpv;
      cumulativeVolume += candle.volume;
      
      const vwap = cumulativeVolume > 0 ? cumulativeTPV / cumulativeVolume : typicalPrice;
      results.push(vwap);
    });

    return {
      name: 'VWAP',
      values: results
    };
  }

  static calculateRSI(data: any[], settings: IndicatorSettings = { period: 14, overbought: 70, oversold: 30 }): IndicatorResult {
    const { period } = settings;
    const results: number[] = [];
    const signals: string[] = [];
    
    let gains: number[] = [];
    let losses: number[] = [];

    data.forEach((candle, index) => {
      if (index === 0) {
        results.push(50);
        signals.push('');
        return;
      }

      const change = candle.close - data[index - 1].close;
      gains.push(change > 0 ? change : 0);
      losses.push(change < 0 ? Math.abs(change) : 0);

      if (gains.length > period) {
        gains.shift();
        losses.shift();
      }

      if (gains.length === period) {
        const avgGain = gains.reduce((a, b) => a + b, 0) / period;
        const avgLoss = losses.reduce((a, b) => a + b, 0) / period;
        
        const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
        const rsi = 100 - (100 / (1 + rs));
        
        results.push(rsi);
        
        if (rsi > settings.overbought) signals.push('SELL');
        else if (rsi < settings.oversold) signals.push('BUY');
        else signals.push('');
      } else {
        results.push(50);
        signals.push('');
      }
    });

    return {
      name: 'RSI',
      values: results,
      signals
    };
  }

  static calculateEMA(data: any[], settings: IndicatorSettings = { period: 20 }): IndicatorResult {
    const { period } = settings;
    const results: number[] = [];
    const multiplier = 2 / (period + 1);
    
    data.forEach((candle, index) => {
      if (index === 0) {
        results.push(candle.close);
      } else {
        const ema = (candle.close * multiplier) + (results[index - 1] * (1 - multiplier));
        results.push(ema);
      }
    });

    return {
      name: `EMA${period}`,
      values: results
    };
  }

  static calculateMACD(data: any[], settings: IndicatorSettings = { fast: 12, slow: 26, signal: 9 }): IndicatorResult {
    const { fast, slow, signal } = settings;
    
    const fastEMA = this.calculateEMA(data, { period: fast });
    const slowEMA = this.calculateEMA(data, { period: slow });
    
    const macdLine: number[] = [];
    const signalLine: number[] = [];
    const histogram: number[] = [];
    const signals: string[] = [];

    fastEMA.values.forEach((fastValue, index) => {
      const slowValue = slowEMA.values[index];
      const macdValue = fastValue - slowValue;
      macdLine.push(macdValue);
    });

    // Calculate signal line (EMA of MACD)
    const signalMultiplier = 2 / (signal + 1);
    macdLine.forEach((macdValue, index) => {
      if (index === 0) {
        signalLine.push(macdValue);
      } else {
        const signalValue = (macdValue * signalMultiplier) + (signalLine[index - 1] * (1 - signalMultiplier));
        signalLine.push(signalValue);
      }
    });

    // Calculate histogram and signals
    macdLine.forEach((macdValue, index) => {
      const signalValue = signalLine[index];
      const histValue = macdValue - signalValue;
      histogram.push(histValue);
      
      if (index > 0) {
        const prevHist = histogram[index - 1];
        if (histValue > 0 && prevHist <= 0) signals.push('BUY');
        else if (histValue < 0 && prevHist >= 0) signals.push('SELL');
        else signals.push('');
      } else {
        signals.push('');
      }
    });

    return {
      name: 'MACD',
      values: macdLine,
      signals,
      levels: {
        signal: signalLine,
        histogram: histogram
      }
    };
  }

  static calculateBollingerBands(data: any[], settings: IndicatorSettings = { period: 20, deviation: 2 }): IndicatorResult {
    const { period, deviation } = settings;
    const sma = this.calculateSMA(data, period);
    
    const upperBand: number[] = [];
    const lowerBand: number[] = [];
    const signals: string[] = [];

    data.forEach((candle, index) => {
      if (index < period - 1) {
        upperBand.push(candle.close);
        lowerBand.push(candle.close);
        signals.push('');
        return;
      }

      const slice = data.slice(index - period + 1, index + 1);
      const mean = sma[index];
      const variance = slice.reduce((sum, c) => sum + Math.pow(c.close - mean, 2), 0) / period;
      const stdDev = Math.sqrt(variance);

      const upper = mean + (deviation * stdDev);
      const lower = mean - (deviation * stdDev);

      upperBand.push(upper);
      lowerBand.push(lower);

      if (candle.close > upper) signals.push('SELL');
      else if (candle.close < lower) signals.push('BUY');
      else signals.push('');
    });

    return {
      name: 'Bollinger Bands',
      values: sma,
      signals,
      levels: {
        upper: upperBand,
        lower: lowerBand
      }
    };
  }

  private static calculateSMA(data: any[], period: number): number[] {
    const results: number[] = [];
    
    data.forEach((candle, index) => {
      if (index < period - 1) {
        results.push(candle.close);
        return;
      }
      
      const slice = data.slice(index - period + 1, index + 1);
      const sum = slice.reduce((total, c) => total + c.close, 0);
      results.push(sum / period);
    });
    
    return results;
  }

  private static calculateATR(data: any[], period: number): IndicatorResult {
    const results: number[] = [];
    const trueRanges: number[] = [];

    data.forEach((candle, index) => {
      if (index === 0) {
        trueRanges.push(candle.high - candle.low);
      } else {
        const prevClose = data[index - 1].close;
        const tr = Math.max(
          candle.high - candle.low,
          Math.abs(candle.high - prevClose),
          Math.abs(candle.low - prevClose)
        );
        trueRanges.push(tr);
      }

      if (trueRanges.length >= period) {
        const atr = trueRanges.slice(-period).reduce((a, b) => a + b, 0) / period;
        results.push(atr);
      } else {
        results.push(trueRanges[trueRanges.length - 1]);
      }
    });

    return {
      name: 'ATR',
      values: results
    };
  }
}