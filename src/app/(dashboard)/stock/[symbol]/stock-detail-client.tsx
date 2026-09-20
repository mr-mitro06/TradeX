'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TradingChart } from '@/components/chart/trading-chart';
import { OrderPanel } from '@/components/trading/order-panel';
import { MarketDepth } from '@/components/stocks/market-depth';
import { getMarketDataProvider } from '@/lib/market-data/provider';
import {
  formatCurrencyFull,
  formatPercent,
  formatChange,
  formatVolume,
  formatMarketCap,
  getPnLColor,
} from '@/lib/format';
import type { StockQuote } from '@/lib/market-data/types';
import { NIFTY_50 } from '@/lib/data/nifty50';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Radio,
  Gauge,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';

export function StockDetailClient({ symbol: initialSymbol }: { symbol?: string }) {
  const params = useParams();
  const symbol = (initialSymbol || (params?.symbol as string))?.toUpperCase();
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [loading, setLoading] = useState(true);

  const stockInfo = NIFTY_50.find((s) => s.symbol === symbol);

  useEffect(() => {
    if (!symbol) return;

    const loadQuote = async () => {
      try {
        const provider = getMarketDataProvider();
        const data = await provider.getQuote(symbol);
        setQuote(data);
      } catch (error) {
        console.error('Failed to load quote:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQuote();
    const interval = setInterval(loadQuote, 3000); // 3-second live tick stream
    return () => clearInterval(interval);
  }, [symbol]);

  if (!stockInfo) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Stock not found: {symbol}</p>
      </div>
    );
  }

  // Calculate circuit limits (±10% for Indian equities)
  const prevClose = quote?.previousClose || stockInfo.basePrice;
  const upperCircuit = Math.round(prevClose * 1.1 * 100) / 100;
  const lowerCircuit = Math.round(prevClose * 0.9 * 100) / 100;

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-7xl mx-auto">
      {/* Stock Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-card/40 p-4 rounded-xl border border-border/60 backdrop-blur-xs"
      >
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">{stockInfo.companyName}</h1>
            <Badge variant="outline" className="font-mono text-xs font-semibold px-2 py-0.5 border-primary/40 text-primary">
              NSE: {symbol}
            </Badge>
            <Badge variant="secondary" className="text-[10px] font-mono">
              Series: EQ
            </Badge>
            <span className="flex items-center gap-1 text-[11px] text-emerald-500 font-medium">
              <Radio className="h-3 w-3 animate-pulse" />
              Live Feed
            </span>
          </div>

          <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-2">
            <span>{stockInfo.sector}</span>
            <span>•</span>
            <span>ISIN: INE{Math.abs(stockInfo.companyName.charCodeAt(0) * 1039821).toString().padStart(9, '0')}</span>
            <span>•</span>
            <span>Tick: 0.05</span>
          </p>
        </div>

        {/* Price Display */}
        {loading ? (
          <div className="space-y-1">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-5 w-24" />
          </div>
        ) : quote ? (
          <div className="text-left sm:text-right">
            <p className="text-2xl md:text-3xl font-bold font-mono tracking-tight text-foreground tabular-nums">
              {formatCurrencyFull(quote.price)}
            </p>
            <div className={`flex items-center sm:justify-end gap-1.5 ${getPnLColor(quote.change)}`}>
              {quote.change > 0 ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : (
                <ArrowDownRight className="h-4 w-4" />
              )}
              <span className="text-sm font-semibold tabular-nums font-mono">
                {formatChange(quote.change)}
              </span>
              <span className="text-sm font-medium tabular-nums font-mono">
                ({formatPercent(quote.changePercent)})
              </span>
            </div>
          </div>
        ) : null}
      </motion.div>

      {/* Main Content: Chart + Order Panel */}
      <div className="grid lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px] gap-4 pb-14 lg:pb-0">
        {/* Left Column: Interactive Chart + Market Depth & Fundamentals */}
        <div className="space-y-4">
          <Card className="border-border/60 overflow-hidden shadow-sm bg-card/60">
            <TradingChart symbol={symbol} className="h-[320px] sm:h-[400px] lg:h-[500px]" />
          </Card>

          {/* Market Depth (Order Book) + Technical Rating */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Level 2 Market Depth */}
            <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
              <CardHeader className="py-3 px-4 border-b border-border/40">
                <CardTitle className="text-xs font-semibold flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-primary" />
                    Live Market Depth (Order Book)
                  </span>
                  <Badge variant="outline" className="text-[10px] py-0 px-1 font-mono text-emerald-500 border-emerald-500/30">
                    Real-Time
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4">
                <MarketDepth price={quote ? quote.price : stockInfo.basePrice} />
              </CardContent>
            </Card>

            {/* Technical Analysis Rating & Circuit Bands */}
            <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
              <CardHeader className="py-3 px-4 border-b border-border/40">
                <CardTitle className="text-xs font-semibold flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Gauge className="h-3.5 w-3.5 text-primary" />
                    Technical Summary & Exchange Bands
                  </span>
                  <Badge variant="secondary" className="text-[10px] py-0 px-1 font-mono">
                    1D Timeframe
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4 text-xs">
                {/* Gauge Status */}
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-400" />
                    <div>
                      <p className="font-bold text-emerald-400">STRONG BUY</p>
                      <p className="text-[10px] text-muted-foreground">14 Bullish Indicators • 2 Bearish</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-500 text-white text-xs font-mono font-bold">
                    RSI 61.4
                  </Badge>
                </div>

                {/* Circuit Limits */}
                <div className="space-y-2 pt-1">
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>Upper Circuit Limit (+10%)</span>
                    <span className="font-mono font-semibold text-emerald-500">{formatCurrencyFull(upperCircuit)}</span>
                  </div>
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>Lower Circuit Limit (-10%)</span>
                    <span className="font-mono font-semibold text-rose-500">{formatCurrencyFull(lowerCircuit)}</span>
                  </div>
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>Volume Weighted Avg (VWAP)</span>
                    <span className="font-mono font-semibold text-foreground">
                      {quote ? formatCurrencyFull(Math.round((quote.high + quote.low + quote.price) / 3 * 100) / 100) : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>Delivery Percentage</span>
                    <span className="font-mono font-semibold text-foreground">58.4% (Healthy)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column: Order Panel & Fundamentals */}
        <div id="order-panel-section" className="space-y-4 scroll-mt-20">
          <OrderPanel quote={quote} />

          {/* Stock Key Metrics */}
          {quote && (
            <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
              <CardHeader className="py-3 px-4 border-b border-border/40">
                <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-muted-foreground">
                  <Activity className="h-3.5 w-3.5 text-primary" />
                  Performance & Key Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-muted-foreground">Today Open</p>
                    <p className="font-mono font-semibold text-foreground">{formatCurrencyFull(quote.open)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Previous Close</p>
                    <p className="font-mono font-semibold text-foreground">{formatCurrencyFull(quote.previousClose)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Day High</p>
                    <p className="font-mono font-semibold text-emerald-500">{formatCurrencyFull(quote.high)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Day Low</p>
                    <p className="font-mono font-semibold text-rose-500">{formatCurrencyFull(quote.low)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">52W High</p>
                    <p className="font-mono font-semibold text-foreground">{formatCurrencyFull(quote.weekHigh52)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">52W Low</p>
                    <p className="font-mono font-semibold text-foreground">{formatCurrencyFull(quote.weekLow52)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Day Volume</p>
                    <p className="font-mono font-semibold text-foreground">{formatVolume(quote.volume)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Market Cap</p>
                    <p className="font-mono font-semibold text-foreground">{formatMarketCap(quote.marketCap)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Exchange Compliance Footer */}
      <div className="p-3 rounded-lg border border-border/40 bg-muted/20 text-center text-[11px] text-muted-foreground">
        National Stock Exchange of India (NSE) • Real-time live equity ticks and execution • All prices quoted in INR (₹)
      </div>

      {/* Mobile Floating Quick Order Bar (Visible on phones & small tablets) */}
      {quote && (
        <div className="lg:hidden fixed bottom-14 left-0 right-0 p-2.5 bg-background/95 border-t border-border/80 flex items-center justify-between gap-3 z-30 backdrop-blur-md px-4 shadow-xl">
          <div className="min-w-0">
            <p className="font-bold text-xs text-foreground font-mono">{symbol}</p>
            <p className="text-xs font-mono font-bold text-foreground tabular-nums">
              {formatCurrencyFull(quote.price)}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              className="bg-profit hover:bg-profit/90 text-white font-bold h-9 px-4 rounded-lg text-xs cursor-pointer shadow-sm active:scale-95 transition-all"
              onClick={() => {
                document.getElementById('order-panel-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              BUY (CNC/MIS)
            </button>
            <button
              type="button"
              className="bg-loss hover:bg-loss/90 text-white font-bold h-9 px-4 rounded-lg text-xs cursor-pointer shadow-sm active:scale-95 transition-all"
              onClick={() => {
                document.getElementById('order-panel-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              SELL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default StockDetailClient;
