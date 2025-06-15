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
  static calculateCPR(data: any[], settings: IndicatorSettings = {}): IndicatorResult {
    const {
      pivotMode = 'Auto',
      showDaily = true,
      showWeekly = false,
      showMonthly = false,
      showNextDay = false,
      showNextWeek = false,
      showNextMonth = false,
      inputsInStatusLine = true
    } = settings;

    const results: number[] = [];
    const levels: { [key: string]: number[] } = {
      pivot: [],
      r1: [],
      r2: [],
      r3: [],
      s1: [],
      s2: [],
      s3: []
    };

    data.forEach((candle, index) => {
      const high = candle.high;
      const low = candle.low;
      const close = candle.close;
      
      // Central Pivot Range calculation
      const pivot = (high + low + close) / 3;
      const bc = (high + low) / 2;
      const tc = (pivot - bc) + pivot;
      
      // Support and Resistance levels
      const r1 = 2 * pivot - low;
      const r2 = pivot + (high - low);
      const r3 = high + 2 * (pivot - low);
      const s1 = 2 * pivot - high;
      const s2 = pivot - (high - low);
      const s3 = low - 2 * (high - pivot);
      
      results.push(pivot);
      levels.pivot.push(pivot);
      levels.r1.push(r1);
      levels.r2.push(r2);
      levels.r3.push(r3);
      levels.s1.push(s1);
      levels.s2.push(s2);
      levels.s3.push(s3);
    });

    return {
      name: 'CPR',
      values: results,
      levels
    };
  }

  static calculateSupertrend(data: any[], settings: IndicatorSettings = {}): IndicatorResult {
    const {
      indicatorTimeframe = 'Chart',
      atrPeriod = 9,
      source = 'HL2',
      atrMultiplier = 2,
      changeATRCalculationMethod = true,
      showBuySellSignals = true,
      highlighterOnOff = true,
      inputsInStatusLine = true
    } = settings;

    const results: number[] = [];
    const signals: string[] = [];
    
    // Calculate ATR first
    const atr = this.calculateATR(data, atrPeriod);
    
    data.forEach((candle, index) => {
      if (index < atrPeriod) {
        results.push(0);
        signals.push('');
        return;
      }
      
      const src = source === 'HL2' ? (candle.high + candle.low) / 2 : candle.close;
      const atrValue = atr.values[index] || 0;
      
      const upperBand = src + (atrMultiplier * atrValue);
      const lowerBand = src - (atrMultiplier * atrValue);
      
      // Simplified supertrend calculation
      const prevClose = data[index - 1]?.close || candle.close;
      const supertrend = candle.close > prevClose ? lowerBand : upperBand;
      
      results.push(supertrend);
      
      if (showBuySellSignals) {
        signals.push(candle.close > supertrend ? 'BUY' : 'SELL');
      } else {
        signals.push('');
      }
    });

    return {
      name: 'Supertrend',
      values: results,
      signals
    };
  }

  static calculateVWAP(data: any[], settings: IndicatorSettings = {}): IndicatorResult {
    const {
      hideVWAPOn1DOrAbove = false,
      anchorPeriod = 'Session',
      source = 'HLC3',
      offset = 0,
      bandsCalculationMode = 'Standard',
      bandsMultiplier1 = 1,
      bandsMultiplier2 = 2,
      bandsMultiplier3 = 3,
      timeframe = 'Chart'
    } = settings;

    const results: number[] = [];
    const levels: { [key: string]: number[] } = {};
    
    let cumulativeTPV = 0;
    let cumulativeVolume = 0;
    let cumulativeSquaredTPV = 0;

    data.forEach((candle, index) => {
      const typicalPrice = source === 'HLC3' ? 
        (candle.high + candle.low + candle.close) / 3 :
        (candle.high + candle.low) / 2;
      
      const tpv = typicalPrice * candle.volume;
      
      cumulativeTPV += tpv;
      cumulativeVolume += candle.volume;
      cumulativeSquaredTPV += typicalPrice * typicalPrice * candle.volume;
      
      const vwap = cumulativeVolume > 0 ? cumulativeTPV / cumulativeVolume : typicalPrice;
      
      // Calculate VWAP bands if enabled
      if (bandsCalculationMode === 'Standard' && cumulativeVolume > 0) {
        const variance = (cumulativeSquaredTPV / cumulativeVolume) - (vwap * vwap);
        const stdDev = Math.sqrt(Math.max(variance, 0));
        
        if (!levels.upper1) {
          levels.upper1 = [];
          levels.lower1 = [];
          levels.upper2 = [];
          levels.lower2 = [];
          levels.upper3 = [];
          levels.lower3 = [];
        }
        
        levels.upper1.push(vwap + (bandsMultiplier1 * stdDev));
        levels.lower1.push(vwap - (bandsMultiplier1 * stdDev));
        levels.upper2.push(vwap + (bandsMultiplier2 * stdDev));
        levels.lower2.push(vwap - (bandsMultiplier2 * stdDev));
        levels.upper3.push(vwap + (bandsMultiplier3 * stdDev));
        levels.lower3.push(vwap - (bandsMultiplier3 * stdDev));
      }
      
      results.push(vwap);
    });

    return {
      name: 'VWAP',
      values: results,
      levels: Object.keys(levels).length > 0 ? levels : undefined
    };
  }

  static calculateRSI(data: any[], settings: IndicatorSettings = { period: 14, overbought: 70, oversold: 30 }): IndicatorResult {
    const { period, overbought, oversold } = settings;
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
        
        if (rsi > overbought) signals.push('SELL');
        else if (rsi < oversold) signals.push('BUY');
        else signals.push('');
      } else {
        results.push(50);
        signals.push('');
      }
    });

    return {
      name: 'RSI',
      values: results,
      signals,
      levels: {
        overbought: new Array(results.length).fill(overbought),
        oversold: new Array(results.length).fill(oversold)
      }
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