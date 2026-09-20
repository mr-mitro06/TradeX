'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  createChart,
  CandlestickSeries,
  LineSeries,
  AreaSeries,
  HistogramSeries,
  type IChartApi,
  type ISeriesApi,
  type CandlestickData,
  type LineData,
  type Time,
  ColorType,
} from 'lightweight-charts';
import { useTheme } from 'next-themes';
import { getMarketDataProvider } from '@/lib/market-data/provider';
import type { Timeframe, OHLCV } from '@/lib/market-data/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const TIMEFRAMES: { value: Timeframe; label: string }[] = [
  { value: '1m', label: '1m' },
  { value: '5m', label: '5m' },
  { value: '15m', label: '15m' },
  { value: '30m', label: '30m' },
  { value: '1H', label: '1H' },
  { value: '4H', label: '4H' },
  { value: '1D', label: '1D' },
  { value: '1W', label: '1W' },
  { value: '1M', label: '1M' },
];

type ChartMode = 'candlestick' | 'line' | 'area';

interface TradingChartProps {
  symbol: string;
  className?: string;
}

export function TradingChart({ symbol, className }: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const mainSeriesRef = useRef<ISeriesApi<'Candlestick'> | ISeriesApi<'Line'> | ISeriesApi<'Area'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);

  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [chartMode, setChartMode] = useState<ChartMode>('candlestick');
  const [loading, setLoading] = useState(true);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const getChartColors = useCallback(() => {
    return isDark
      ? {
          background: 'rgb(15, 17, 30)',
          text: 'rgba(255, 255, 255, 0.6)',
          grid: 'rgba(255, 255, 255, 0.04)',
          border: 'rgba(255, 255, 255, 0.08)',
          crosshair: 'rgba(255, 255, 255, 0.3)',
          upColor: '#22c55e',
          downColor: '#ef4444',
          upWick: '#22c55e',
          downWick: '#ef4444',
          volumeUp: 'rgba(34, 197, 94, 0.15)',
          volumeDown: 'rgba(239, 68, 68, 0.15)',
          lineColor: '#3b82f6',
          areaTop: 'rgba(59, 130, 246, 0.3)',
          areaBottom: 'rgba(59, 130, 246, 0.02)',
        }
      : {
          background: '#ffffff',
          text: 'rgba(0, 0, 0, 0.5)',
          grid: 'rgba(0, 0, 0, 0.04)',
          border: 'rgba(0, 0, 0, 0.08)',
          crosshair: 'rgba(0, 0, 0, 0.3)',
          upColor: '#16a34a',
          downColor: '#dc2626',
          upWick: '#16a34a',
          downWick: '#dc2626',
          volumeUp: 'rgba(22, 163, 74, 0.15)',
          volumeDown: 'rgba(220, 38, 38, 0.15)',
          lineColor: '#2563eb',
          areaTop: 'rgba(37, 99, 235, 0.3)',
          areaBottom: 'rgba(37, 99, 235, 0.02)',
        };
  }, [isDark]);

  const loadData = useCallback(async () => {
    if (!chartRef.current) return;

    setLoading(true);
    try {
      const provider = getMarketDataProvider();
      const data = await provider.getHistoricalData(symbol, timeframe);
      
      const chart = chartRef.current;
      const colors = getChartColors();

      // Remove existing series
      if (mainSeriesRef.current) {
        chart.removeSeries(mainSeriesRef.current);
        mainSeriesRef.current = null;
      }
      if (volumeSeriesRef.current) {
        chart.removeSeries(volumeSeriesRef.current);
        volumeSeriesRef.current = null;
      }

      // Create main series based on mode
      if (chartMode === 'candlestick') {
        const series = chart.addSeries(CandlestickSeries, {
          upColor: colors.upColor,
          downColor: colors.downColor,
          borderVisible: false,
          wickUpColor: colors.upWick,
          wickDownColor: colors.downWick,
        });
        series.setData(
          data.map((d) => ({
            time: d.time as Time,
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.close,
          }))
        );
        mainSeriesRef.current = series;
      } else if (chartMode === 'line') {
        const series = chart.addSeries(LineSeries, {
          color: colors.lineColor,
          lineWidth: 2,
        });
        series.setData(
          data.map((d) => ({
            time: d.time as Time,
            value: d.close,
          }))
        );
        mainSeriesRef.current = series;
      } else {
        const series = chart.addSeries(AreaSeries, {
          lineColor: colors.lineColor,
          topColor: colors.areaTop,
          bottomColor: colors.areaBottom,
          lineWidth: 2,
        });
        series.setData(
          data.map((d) => ({
            time: d.time as Time,
            value: d.close,
          }))
        );
        mainSeriesRef.current = series;
      }

      // Add volume histogram
      const volumeSeries = chart.addSeries(HistogramSeries, {
        priceFormat: { type: 'volume' },
        priceScaleId: 'volume',
      });

      chart.priceScale('volume').applyOptions({
        scaleMargins: { top: 0.8, bottom: 0 },
      });

      volumeSeries.setData(
        data.map((d) => ({
          time: d.time as Time,
          value: d.volume,
          color: d.close >= d.open ? colors.volumeUp : colors.volumeDown,
        }))
      );
      volumeSeriesRef.current = volumeSeries;

      chart.timeScale().fitContent();
    } catch (error) {
      console.error('Failed to load chart data:', error);
    } finally {
      setLoading(false);
    }
  }, [symbol, timeframe, chartMode, getChartColors]);

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const colors = getChartColors();

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: colors.background },
        textColor: colors.text,
        fontFamily: "'Inter', sans-serif",
        fontSize: 12,
      },
      grid: {
        vertLines: { color: colors.grid },
        horzLines: { color: colors.grid },
      },
      crosshair: {
        vertLine: { color: colors.crosshair, labelBackgroundColor: isDark ? '#1e293b' : '#e2e8f0' },
        horzLine: { color: colors.crosshair, labelBackgroundColor: isDark ? '#1e293b' : '#e2e8f0' },
      },
      rightPriceScale: {
        borderColor: colors.border,
      },
      timeScale: {
        borderColor: colors.border,
        timeVisible: ['1m', '5m', '15m', '30m', '1H', '4H'].includes(timeframe),
      },
      handleScroll: { vertTouchDrag: false },
    });

    chartRef.current = chart;

    // Responsive resize
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        chart.applyOptions({ width, height });
      }
    });
    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = null;
    };
  }, [isDark, getChartColors]); // Re-create on theme change

  // Load data when timeframe/mode changes
  useEffect(() => {
    if (chartRef.current) {
      loadData();
    }
  }, [loadData]);

  return (
    <div className={cn('flex flex-col', className)}>
      {/* Chart Toolbar */}
      <div className="flex items-center justify-between px-2 sm:px-3 py-1.5 sm:py-2 border-b border-border/60 gap-2 overflow-x-auto no-scrollbar">
        {/* Timeframe selector */}
        <div className="flex items-center gap-1 shrink-0">
          {TIMEFRAMES.map((tf) => (
            <Button
              key={tf.value}
              variant={timeframe === tf.value ? 'default' : 'ghost'}
              size="sm"
              className="h-6 sm:h-7 px-1.5 sm:px-2 text-[11px] sm:text-xs font-mono cursor-pointer"
              onClick={() => setTimeframe(tf.value)}
            >
              {tf.label}
            </Button>
          ))}
        </div>

        {/* Chart type selector */}
        <div className="flex items-center gap-1 shrink-0">
          {(['candlestick', 'line', 'area'] as ChartMode[]).map((mode) => (
            <Button
              key={mode}
              variant={chartMode === mode ? 'secondary' : 'ghost'}
              size="sm"
              className="h-6 sm:h-7 px-1.5 sm:px-2 text-[11px] sm:text-xs capitalize cursor-pointer font-medium"
              onClick={() => setChartMode(mode)}
            >
              {mode === 'candlestick' ? '🕯️' : mode === 'line' ? '📈' : '📊'} <span className="hidden xs:inline">{mode}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative flex-1 min-h-[350px] md:min-h-[450px]">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
            <div className="text-sm text-muted-foreground">Loading chart...</div>
          </div>
        )}
        <div ref={chartContainerRef} className="w-full h-full" />
      </div>
    </div>
  );
}
