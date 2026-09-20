'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useTradeXStore } from '@/lib/store';
import { getMarketDataProvider } from '@/lib/market-data/provider';
import { formatCurrencyFull, formatPercent, getPnLColor } from '@/lib/format';
import type { StockQuote } from '@/lib/market-data/types';
import { Star, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function WatchlistPage() {
  const { watchlist, setWatchlist } = useTradeXStore();
  const [quotes, setQuotes] = useState<Map<string, StockQuote>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('tradex-watchlist');
    if (saved) setWatchlist(JSON.parse(saved));
    setLoading(false);
  }, [setWatchlist]);

  useEffect(() => {
    if (watchlist.length === 0) return;
    const load = async () => {
      const provider = getMarketDataProvider();
      const data = await provider.getQuotes(watchlist.map(w => w.stockSymbol));
      const map = new Map<string, StockQuote>();
      data.forEach(q => map.set(q.symbol, q));
      setQuotes(map);
    };
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, [watchlist]);

  const removeFromWatchlist = (symbol: string) => {
    const updated = watchlist.filter(w => w.stockSymbol !== symbol);
    setWatchlist(updated);
    localStorage.setItem('tradex-watchlist', JSON.stringify(updated));
    toast.success(`${symbol} removed from watchlist`);
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Star className="h-6 w-6 text-primary" />
          Watchlist
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{watchlist.length} stocks watched</p>
      </div>

      {loading ? (
        <div className="space-y-2">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
      ) : watchlist.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="py-16 text-center">
            <Star className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Your watchlist is empty</h3>
            <p className="text-sm text-muted-foreground mb-4">Add stocks from the NIFTY 50 list to watch them</p>
            <Link href="/nifty50"><Button>Browse NIFTY 50</Button></Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {watchlist.map((item, i) => {
            const quote = quotes.get(item.stockSymbol);
            return (
              <motion.div key={item.stockSymbol} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                <Card className="border-border/50 hover:border-primary/30 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <Link href={`/stock/${item.stockSymbol}`} className="flex-1">
                        <p className="font-medium">{item.stockSymbol}</p>
                        {quote && (
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm tabular-nums">{formatCurrencyFull(quote.price)}</span>
                            <span className={`text-xs tabular-nums ${getPnLColor(quote.changePercent)}`}>
                              {formatPercent(quote.changePercent)}
                            </span>
                          </div>
                        )}
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromWatchlist(item.stockSymbol)}
                        className="h-8 w-8 text-yellow-500 hover:text-muted-foreground"
                      >
                        <Star className="h-4 w-4 fill-current" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
