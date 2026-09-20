'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getMarketDataProvider } from '@/lib/market-data/provider';
import { NIFTY_50 } from '@/lib/data/nifty50';
import { formatCurrencyFull, formatPercent, getPnLColor } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { StockQuote } from '@/lib/market-data/types';
import { Zap, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

type Period = '1D' | '1W' | '1M' | '3M' | '1Y';

export default function HighPerformancePage() {
  const [quotes, setQuotes] = useState<StockQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortPeriod, setSortPeriod] = useState<Period>('1D');

  useEffect(() => {
    const load = async () => {
      const provider = getMarketDataProvider();
      const data = await provider.getQuotes(NIFTY_50.map(s => s.symbol));
      setQuotes(data);
      setLoading(false);
    };
    load();
  }, []);

  // Simulate multi-period performance based on current change
  const enriched = useMemo(() => {
    return quotes.map(q => {
      const seed = q.symbol.length * 17 + q.price;
      return {
        ...q,
        perf1D: q.changePercent,
        perf1W: q.changePercent * (2 + (seed % 5)),
        perf1M: q.changePercent * (5 + (seed % 10)),
        perf3M: q.changePercent * (10 + (seed % 15)),
        perf1Y: q.changePercent * (20 + (seed % 30)),
      };
    });
  }, [quotes]);

  const sorted = useMemo(() => {
    const key = {
      '1D': 'perf1D',
      '1W': 'perf1W',
      '1M': 'perf1M',
      '3M': 'perf3M',
      '1Y': 'perf1Y',
    }[sortPeriod] as keyof (typeof enriched)[0];
    
    return [...enriched].sort((a, b) => (b[key] as number) - (a[key] as number));
  }, [enriched, sortPeriod]);

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary" />
          High Performance Stocks
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Top momentum NSE blue-chips sorted by {sortPeriod} gainers
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['1D', '1W', '1M', '3M', '1Y'] as Period[]).map(p => (
          <Button
            key={p}
            variant={sortPeriod === p ? 'default' : 'outline'}
            size="sm"
            className="text-xs font-mono cursor-pointer"
            onClick={() => setSortPeriod(p)}
          >
            {p} Performance
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <Card className="border-border/60 overflow-hidden shadow-xs bg-card/60">
          {/* Mobile Card List (< md) */}
          <div className="md:hidden divide-y divide-border/40">
            {sorted.map((stock) => {
              const activeVal = (stock as any)[`perf${sortPeriod}`] as number;
              const isPositive = activeVal >= 0;
              return (
                <Link key={stock.symbol} href={`/stock/${stock.symbol}`}>
                  <div className="flex items-center justify-between p-3.5 hover:bg-muted/30 transition-colors cursor-pointer active:bg-muted/50">
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-sm tracking-tight text-foreground">{stock.symbol}</p>
                        <Badge variant="secondary" className="text-[9px] py-0 px-1 font-mono text-muted-foreground">
                          EQ
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{formatCurrencyFull(stock.price)}</p>
                      <div className="flex gap-2 text-[10px] font-mono text-muted-foreground mt-1">
                        <span>1D: {formatPercent(stock.perf1D)}</span>
                        <span>•</span>
                        <span>1M: {formatPercent(stock.perf1M)}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-[10px] text-muted-foreground font-mono">{sortPeriod} Return</p>
                      <div
                        className={cn(
                          'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-bold mt-0.5',
                          isPositive ? 'bg-profit/15 text-profit' : 'bg-loss/15 text-loss'
                        )}
                      >
                        {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                        <span>
                          {isPositive ? '+' : ''}{formatPercent(activeVal)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Desktop & Laptop Table (>= md) */}
          <div className="hidden md:block overflow-x-auto">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-2 px-4 py-3 border-b border-border bg-muted/30 min-w-[700px]">
              <span className="text-xs font-semibold text-muted-foreground">Stock</span>
              <span className="text-xs font-semibold text-muted-foreground text-right">1D Return</span>
              <span className="text-xs font-semibold text-muted-foreground text-right">1W Return</span>
              <span className="text-xs font-semibold text-muted-foreground text-right">1M Return</span>
              <span className="text-xs font-semibold text-muted-foreground text-right">3M Return</span>
              <span className="text-xs font-semibold text-muted-foreground text-right">1Y Return</span>
            </div>
            <div className="divide-y divide-border min-w-[700px]">
              {sorted.map((stock, i) => (
                <motion.div key={stock.symbol} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.015 }}>
                  <Link href={`/stock/${stock.symbol}`}>
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-2 px-4 py-3 hover:bg-muted/30 transition-colors cursor-pointer items-center">
                      <div>
                        <p className="text-sm font-semibold">{stock.symbol}</p>
                        <p className="text-xs text-muted-foreground font-mono">{formatCurrencyFull(stock.price)}</p>
                      </div>
                      <p className={`text-sm text-right font-mono tabular-nums ${getPnLColor(stock.perf1D)}`}>
                        {formatPercent(stock.perf1D)}
                      </p>
                      <p className={`text-sm text-right font-mono tabular-nums ${getPnLColor(stock.perf1W)}`}>
                        {formatPercent(stock.perf1W)}
                      </p>
                      <p className={`text-sm text-right font-mono tabular-nums ${getPnLColor(stock.perf1M)}`}>
                        {formatPercent(stock.perf1M)}
                      </p>
                      <p className={`text-sm text-right font-mono tabular-nums ${getPnLColor(stock.perf3M)}`}>
                        {formatPercent(stock.perf3M)}
                      </p>
                      <p className={`text-sm text-right font-mono tabular-nums ${getPnLColor(stock.perf1Y)}`}>
                        {formatPercent(stock.perf1Y)}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
