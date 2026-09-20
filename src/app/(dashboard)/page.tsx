'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useTradeXStore } from '@/lib/store';
import { getMarketDataProvider } from '@/lib/market-data/provider';
import { formatCurrencyFull, formatPercent, formatChange, getPnLColor } from '@/lib/format';
import type { StockQuote } from '@/lib/market-data/types';
import { NIFTY_50 } from '@/lib/data/nifty50';
import { motion } from 'framer-motion';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Briefcase,
  DollarSign,
  Activity,
} from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const { wallet, positions } = useTradeXStore();
  const [quotes, setQuotes] = useState<StockQuote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const provider = getMarketDataProvider();
        const symbols = NIFTY_50.slice(0, 20).map((s) => s.symbol);
        const data = await provider.getQuotes(symbols);
        setQuotes(data);
      } catch (error) {
        console.error('Failed to load market data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const topGainers = [...quotes].sort((a, b) => b.changePercent - a.changePercent).slice(0, 5);
  const topLosers = [...quotes].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5);
  const niftyQuote = quotes.find((q) => q.symbol === 'RELIANCE') || quotes[0] || null;

  // Calculate portfolio summary
  const investedValue = positions.reduce((sum, p) => sum + p.investedValue, 0);
  const currentValue = positions.reduce((sum, p) => sum + p.currentValue, 0);
  const totalPnL = currentValue - investedValue;
  const totalPnLPercent = investedValue > 0 ? (totalPnL / investedValue) * 100 : 0;
  const portfolioValue = (wallet?.balance || 0) + currentValue;

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Trading Dashboard</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            NSE Live Market Overview & Account Performance
          </p>
        </div>
      </div>

      {/* Portfolio Summary Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3"
      >
        <motion.div variants={item}>
          <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1.5">
                <PieChart className="h-3.5 w-3.5 text-primary" />
                <span className="text-[11px] font-medium">Portfolio Value</span>
              </div>
              {wallet ? (
                <p className="text-base sm:text-lg font-bold font-mono tracking-tight tabular-nums text-foreground">
                  {formatCurrencyFull(portfolioValue)}
                </p>
              ) : (
                <Skeleton className="h-6 w-20" />
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1.5">
                <Wallet className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-[11px] font-medium">Available Cash</span>
              </div>
              {wallet ? (
                <p className="text-base sm:text-lg font-bold font-mono tracking-tight tabular-nums text-foreground">
                  {formatCurrencyFull(wallet.balance)}
                </p>
              ) : (
                <Skeleton className="h-6 w-20" />
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1.5">
                <DollarSign className="h-3.5 w-3.5 text-primary" />
                <span className="text-[11px] font-medium">Invested Cost</span>
              </div>
              <p className="text-base sm:text-lg font-bold font-mono tracking-tight tabular-nums text-foreground">
                {formatCurrencyFull(investedValue)}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1.5">
                <Activity className="h-3.5 w-3.5 text-primary" />
                <span className="text-[11px] font-medium">Unrealized P&L</span>
              </div>
              <p className={`text-base sm:text-lg font-bold font-mono tracking-tight tabular-nums ${getPnLColor(totalPnL)}`}>
                {formatChange(totalPnL)}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1.5">
                <BarChart3 className="h-3.5 w-3.5 text-primary" />
                <span className="text-[11px] font-medium">Returns (%)</span>
              </div>
              <p className={`text-base sm:text-lg font-bold font-mono tracking-tight tabular-nums ${getPnLColor(totalPnL)}`}>
                {formatPercent(totalPnLPercent)}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1.5">
                <Briefcase className="h-3.5 w-3.5 text-cyan-400" />
                <span className="text-[11px] font-medium">Open Positions</span>
              </div>
              <p className="text-base sm:text-lg font-bold font-mono tracking-tight tabular-nums text-foreground">
                {positions.length}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Market Overview */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-xs shadow-xs">
        <CardHeader className="pb-3 px-4 pt-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              NIFTY 50 Index Overview
            </CardTitle>
            <Link href="/nifty50">
              <Button variant="ghost" size="sm" className="text-xs h-7 gap-1 cursor-pointer">
                View All Stocks
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-foreground">
                {niftyQuote ? formatCurrencyFull(niftyQuote.price) : '24,835.40'}
              </p>
              {niftyQuote && (
                <div className={`flex items-center gap-1.5 mt-1 ${getPnLColor(niftyQuote.change)}`}>
                  {niftyQuote.change > 0 ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  <span className="text-sm font-semibold font-mono tabular-nums">
                    {formatChange(niftyQuote.change)}
                  </span>
                  <span className="text-sm font-medium font-mono tabular-nums">
                    ({formatPercent(niftyQuote.changePercent)})
                  </span>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div>
                <p className="text-muted-foreground">Day High</p>
                <p className="font-semibold text-emerald-500">
                  {niftyQuote ? formatCurrencyFull(niftyQuote.high) : '24,912.00'}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Day Low</p>
                <p className="font-semibold text-rose-500">
                  {niftyQuote ? formatCurrencyFull(niftyQuote.low) : '24,780.20'}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">52W High</p>
                <p className="font-semibold text-foreground">
                  {niftyQuote ? formatCurrencyFull(niftyQuote.weekHigh52) : '26,277.35'}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">52W Low</p>
                <p className="font-semibold text-foreground">
                  {niftyQuote ? formatCurrencyFull(niftyQuote.weekLow52) : '19,678.65'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Gainers & Losers */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Top Gainers */}
        <motion.div variants={item} initial="hidden" animate="show">
          <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
            <CardHeader className="pb-2 px-4 pt-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-profit" />
                  Top Gainers (NSE)
                </CardTitle>
                <Link href="/nifty50">
                  <Button variant="ghost" size="sm" className="text-xs h-7 cursor-pointer">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  {topGainers.map((stock) => (
                    <Link key={stock.symbol} href={`/stock/${stock.symbol}`}>
                      <div className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                        <div>
                          <p className="text-sm font-medium">{stock.symbol}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[140px]">
                            {stock.companyName}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium tabular-nums">
                            {formatCurrencyFull(stock.price)}
                          </p>
                          <div className="flex items-center gap-1 justify-end">
                            <ArrowUpRight className="h-3 w-3 text-profit" />
                            <span className="text-xs text-profit tabular-nums">
                              {formatPercent(stock.changePercent)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Losers */}
        <motion.div variants={item} initial="hidden" animate="show">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-loss" />
                  Top Losers
                </CardTitle>
                <Link href="/markets">
                  <Button variant="ghost" size="sm" className="text-xs h-7">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  {topLosers.map((stock) => (
                    <Link key={stock.symbol} href={`/stock/${stock.symbol}`}>
                      <div className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                        <div>
                          <p className="text-sm font-medium">{stock.symbol}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[140px]">
                            {stock.companyName}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium tabular-nums">
                            {formatCurrencyFull(stock.price)}
                          </p>
                          <div className="flex items-center gap-1 justify-end">
                            <ArrowDownRight className="h-3 w-3 text-loss" />
                            <span className="text-xs text-loss tabular-nums">
                              {formatPercent(stock.changePercent)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <Link href="/nifty50">
              <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-1.5">
                📊 NIFTY 50
              </Badge>
            </Link>
            <Link href="/52w-high">
              <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-1.5">
                📈 52W High
              </Badge>
            </Link>
            <Link href="/high-performance">
              <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-1.5">
                ⚡ High Performance
              </Badge>
            </Link>
            <Link href="/funds">
              <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-1.5">
                💰 Add Funds
              </Badge>
            </Link>
            <Link href="/portfolio">
              <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-1.5">
                💼 Portfolio
              </Badge>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Live Market Notice */}
      <div className="text-center py-2">
        <p className="text-xs text-muted-foreground/70 flex items-center justify-center gap-1.5 font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block animate-ping" />
          Live NSE Market Feed Active • National Stock Exchange Equity & Derivatives
        </p>
      </div>
    </div>
  );
}
