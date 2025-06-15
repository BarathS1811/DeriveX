import React, { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData, LineData } from 'lightweight-charts';
import { TechnicalIndicators, IndicatorSettings } from '../services/TechnicalIndicators';

interface CandlestickChartProps {
  data: any[];
  indicators: string[];
  indicatorSettings: { [key: string]: IndicatorSettings };
  timeframe: string;
  onTimeframeChange: (timeframe: string) => void;
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({
  data,
  indicators,
  indicatorSettings,
  timeframe,
  onTimeframeChange
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const indicatorSeriesRef = useRef<{ [key: string]: ISeriesApi<any> }>({});

  const timeframes = [
    { label: '1m', value: '1m' },
    { label: '5m', value: '5m' },
    { label: '15m', value: '15m' },
    { label: '30m', value: '30m' },
    { label: '1h', value: '1h' },
    { label: '2h', value: '2h' },
    { label: '4h', value: '4h' },
    { label: '1d', value: '1d' },
    { label: '1w', value: '1w' }
  ];

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart with candlestick configuration
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 500,
      layout: {
        background: { color: '#1F2937' },
        textColor: '#D1D5DB',
      },
      grid: {
        vertLines: { color: '#374151' },
        horzLines: { color: '#374151' },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: '#4B5563',
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      timeScale: {
        borderColor: '#4B5563',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartRef.current = chart;

    // Create candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#10B981',
      downColor: '#EF4444',
      borderDownColor: '#EF4444',
      borderUpColor: '#10B981',
      wickDownColor: '#EF4444',
      wickUpColor: '#10B981',
    });

    candlestickSeriesRef.current = candlestickSeries;

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!candlestickSeriesRef.current || !data.length) return;

    // Convert data to lightweight-charts candlestick format
    const candlestickData: CandlestickData[] = data.map(item => ({
      time: new Date(item.time).getTime() / 1000,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
    }));

    candlestickSeriesRef.current.setData(candlestickData);
  }, [data]);

  useEffect(() => {
    if (!chartRef.current || !data.length) return;

    // Clear existing indicator series
    Object.values(indicatorSeriesRef.current).forEach(series => {
      chartRef.current?.removeSeries(series);
    });
    indicatorSeriesRef.current = {};

    // Add indicator series
    indicators.forEach(indicatorName => {
      const settings = indicatorSettings[indicatorName] || {};
      let indicatorResult;

      switch (indicatorName) {
        case 'CPR':
          indicatorResult = TechnicalIndicators.calculateCPR(data, settings);
          break;
        case 'Supertrend':
          indicatorResult = TechnicalIndicators.calculateSupertrend(data, settings);
          break;
        case 'VWAP':
          indicatorResult = TechnicalIndicators.calculateVWAP(data, settings);
          break;
        case 'RSI':
          indicatorResult = TechnicalIndicators.calculateRSI(data, settings);
          break;
        case 'EMA20':
          indicatorResult = TechnicalIndicators.calculateEMA(data, { period: 20 });
          break;
        case 'EMA200':
          indicatorResult = TechnicalIndicators.calculateEMA(data, { period: 200 });
          break;
        case 'MACD':
          indicatorResult = TechnicalIndicators.calculateMACD(data, settings);
          break;
        case 'BollingerBands':
          indicatorResult = TechnicalIndicators.calculateBollingerBands(data, settings);
          break;
        default:
          return;
      }

      if (!indicatorResult) return;

      // Add main indicator line
      const lineSeries = chartRef.current!.addLineSeries({
        color: getIndicatorColor(indicatorName),
        lineWidth: 2,
        title: indicatorName,
      });

      const lineData: LineData[] = indicatorResult.values.map((value, index) => ({
        time: new Date(data[index].time).getTime() / 1000,
        value: value,
      })).filter(item => !isNaN(item.value) && isFinite(item.value));

      lineSeries.setData(lineData);
      indicatorSeriesRef.current[indicatorName] = lineSeries;

      // Add additional levels for specific indicators
      if (indicatorResult.levels) {
        Object.entries(indicatorResult.levels).forEach(([levelName, levelValues]) => {
          const levelSeries = chartRef.current!.addLineSeries({
            color: getIndicatorColor(`${indicatorName}_${levelName}`),
            lineWidth: 1,
            lineStyle: 2, // Dashed
            title: `${indicatorName} ${levelName}`,
          });

          const levelData: LineData[] = levelValues.map((value, index) => ({
            time: new Date(data[index].time).getTime() / 1000,
            value: value,
          })).filter(item => !isNaN(item.value) && isFinite(item.value));

          levelSeries.setData(levelData);
          indicatorSeriesRef.current[`${indicatorName}_${levelName}`] = levelSeries;
        });
      }
    });
  }, [indicators, indicatorSettings, data]);

  const getIndicatorColor = (indicatorName: string): string => {
    const colors: { [key: string]: string } = {
      'CPR': '#0EA5E9',
      'CPR_r1': '#F59E0B',
      'CPR_r2': '#EF4444',
      'CPR_r3': '#DC2626',
      'CPR_s1': '#10B981',
      'CPR_s2': '#059669',
      'CPR_s3': '#047857',
      'Supertrend': '#F59E0B',
      'VWAP': '#10B981',
      'VWAP_upper1': '#EF4444',
      'VWAP_lower1': '#10B981',
      'VWAP_upper2': '#DC2626',
      'VWAP_lower2': '#059669',
      'VWAP_upper3': '#B91C1C',
      'VWAP_lower3': '#047857',
      'RSI': '#8B5CF6',
      'RSI_overbought': '#EF4444',
      'RSI_oversold': '#10B981',
      'EMA20': '#0EA5E9',
      'EMA200': '#EF4444',
      'MACD': '#F59E0B',
      'MACD_signal': '#10B981',
      'MACD_histogram': '#8B5CF6',
      'BollingerBands': '#0EA5E9',
      'BollingerBands_upper': '#EF4444',
      'BollingerBands_lower': '#10B981',
    };
    return colors[indicatorName] || '#9CA3AF';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400">Timeframe:</span>
        {timeframes.map(tf => (
          <button
            key={tf.value}
            onClick={() => onTimeframeChange(tf.value)}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              timeframe === tf.value
                ? 'bg-primary text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {tf.label}
          </button>
        ))}
      </div>
      <div ref={chartContainerRef} className="w-full h-[500px] bg-gray-800 rounded-lg" />
    </div>
  );
};

export default CandlestickChart;