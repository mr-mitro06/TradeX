'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTradeXStore } from '@/lib/store';
import { getMarketDataProvider } from '@/lib/market-data/provider';
import { formatCurrencyFull, formatPercent, formatChange, getPnLColor } from '@/lib/format';
import { Briefcase, TrendingUp, ArrowUpRight, BarChart3, ShieldCheck, Download, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PortfolioPage() {
  const { positions, setPositions, wallet } = useTradeXStore();
  const [activeTab, setActiveTab] = useState<'all' | 'cnc' | 'mis'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load positions from localStorage
    const saved = localStorage.getItem('tradex-positions');
    if (saved) {
      const parsed = JSON.parse(saved);
      setPositions(parsed);
    }
    setLoading(false);
  }, [setPositions]);

  // Update current prices every 4 seconds
  useEffect(() => {
    if (positions.length === 0) return;

    const updatePrices = async () => {
      const provider = getMarketDataProvider();
      const updated = await Promise.all(
        positions.map(async (pos) => {
          try {
            const quote = await provider.getQuote(pos.stockSymbol);
            return {
              ...pos,
              currentPrice: quote.price,
              currentValue: Math.round(pos.quantity * quote.price * 100) / 100,
              pnl: Math.round((quote.price - pos.averagePrice) * pos.quantity * 100) / 100,
              pnlPercent: Math.round(((quote.price - pos.averagePrice) / pos.averagePrice) * 10000) / 100,
            };
          } catch {
            return pos;
          }
        })
      );
      setPositions(updated);
    };

    updatePrices();
    const interval = setInterval(updatePrices, 4000);
    return () => clearInterval(interval);
  }, [positions.length, setPositions]);

  const filteredPositions = positions.filter((p) => {
    if (activeTab === 'cnc') return p.productType === 'DELIVERY' || !p.productType;
    if (activeTab === 'mis') return p.productType === 'INTRADAY';
    return true;
  });

  const totalInvested = positions.reduce((sum, p) => sum + p.investedValue, 0);
  const totalCurrent = positions.reduce((sum, p) => sum + p.currentValue, 0);
  const totalPnL = totalCurrent - totalInvested;
  const totalPnLPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-primary" />
              Holdings & Positions
            </h1>
            <Badge variant="outline" className="text-xs font-mono border-primary/30 text-primary">
              CDSL: 12081600 03948215
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time Demat equity portfolio & intraday square-off positions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 text-xs gap-1.5 cursor-pointer">
            <Download className="h-3.5 w-3.5" />
            Tax P&L Statement
          </Button>
          <Link href="/nifty50">
            <Button size="sm" className="h-9 text-xs cursor-pointer font-semibold">
              + Trade More Stocks
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Total Invested (Cost)</p>
            <p className="text-xl font-bold font-mono tabular-nums">{formatCurrencyFull(totalInvested)}</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Current Market Value</p>
            <p className="text-xl font-bold font-mono tabular-nums">{formatCurrencyFull(totalCurrent)}</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Total Unrealized P&L</p>
            <p className={`text-xl font-bold font-mono tabular-nums ${getPnLColor(totalPnL)}`}>
              {formatChange(totalPnL)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Overall Returns (%)</p>
            <p className={`text-xl font-bold font-mono tabular-nums ${getPnLColor(totalPnLPercent)}`}>
              {formatPercent(totalPnLPercent)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'all' | 'cnc' | 'mis')}>
          <TabsList className="h-9">
            <TabsTrigger value="all" className="text-xs">
              All ({positions.length})
            </TabsTrigger>
            <TabsTrigger value="cnc" className="text-xs">
              Demat Holdings (CNC)
            </TabsTrigger>
            <TabsTrigger value="mis" className="text-xs">
              Intraday Positions (MIS)
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <span className="text-xs text-muted-foreground hidden sm:inline">
          Live Ticks • Auto-refreshing
        </span>
      </div>

      {/* Positions List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : filteredPositions.length === 0 ? (
        <Card className="border-border/60 bg-card/40">
          <CardContent className="py-16 text-center">
            <Briefcase className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No active {activeTab === 'all' ? 'holdings' : activeTab.toUpperCase()} positions</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Explore NIFTY 50 blue-chip stocks and execute live market orders
            </p>
            <Link href="/nifty50">
              <Button className="cursor-pointer">Browse NIFTY 50</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2.5">
          {filteredPositions.map((pos, index) => {
            const isDelivery = pos.productType === 'DELIVERY' || !pos.productType;
            return (
              <motion.div
                key={pos.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
              >
                <Link href={`/stock/${pos.stockSymbol}`}>
                  <Card className="border-border/60 bg-card/60 backdrop-blur-xs hover:border-primary/40 transition-all cursor-pointer shadow-xs">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-base tracking-tight">{pos.stockSymbol}</span>
                            <Badge
                              variant="outline"
                              className={`text-[10px] py-0 px-1 font-mono ${
                                isDelivery ? 'border-primary/30 text-primary' : 'border-amber-500/30 text-amber-500'
                              }`}
                            >
                              {isDelivery ? 'CNC • Demat' : 'MIS • Intraday 5x'}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{pos.companyName}</p>
                          <p className="text-xs text-muted-foreground mt-1 font-mono">
                            Qty: <strong className="text-foreground">{pos.quantity}</strong> • Avg Price: {formatCurrencyFull(pos.averagePrice)}
                          </p>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-6 sm:text-right">
                          <div>
                            <p className="text-xs text-muted-foreground">Market Value</p>
                            <p className="font-mono font-bold text-base tabular-nums">
                              {formatCurrencyFull(pos.currentValue)}
                            </p>
                            <p className="text-xs text-muted-foreground font-mono tabular-nums">
                              LTP: {formatCurrencyFull(pos.currentPrice)}
                            </p>
                          </div>

                          <div className="text-right min-w-[110px]">
                            <p className="text-xs text-muted-foreground">Unrealized P&L</p>
                            <p className={`font-mono font-bold text-base tabular-nums ${getPnLColor(pos.pnl)}`}>
                              {formatChange(pos.pnl)}
                            </p>
                            <p className={`text-xs font-mono font-semibold tabular-nums ${getPnLColor(pos.pnlPercent)}`}>
                              ({formatPercent(pos.pnlPercent)})
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
