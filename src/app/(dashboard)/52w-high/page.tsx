'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getMarketDataProvider } from '@/lib/market-data/provider';
import { NIFTY_50 } from '@/lib/data/nifty50';
import { formatCurrencyFull, formatPercent, getPnLColor } from '@/lib/format';
import type { StockQuote } from '@/lib/market-data/types';
import { ArrowUpRight, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const FILTERS = [
  { label: 'At 52W High', maxDistance: 0 },
  { label: 'Within 1%', maxDistance: 1 },
  { label: 'Within 3%', maxDistance: 3 },
  { label: 'Within 5%', maxDistance: 5 },
  { label: 'Within 10%', maxDistance: 10 },
];

export default function Week52HighPage() {
  const [quotes, setQuotes] = useState<StockQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(5);

  useEffect(() => {
    const load = async () => {
      const provider = getMarketDataProvider();
      const data = await provider.getQuotes(NIFTY_50.map(s => s.symbol));
      setQuotes(data);
      setLoading(false);
    };
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, []);

  const filtered = useMemo(() => {
    return quotes
      .map(q => ({
        ...q,
        distance: ((q.weekHigh52 - q.price) / q.weekHigh52) * 100,
      }))
      .filter(q => q.distance <= activeFilter)
      .sort((a, b) => a.distance - b.distance);
  }, [quotes, activeFilter]);

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ArrowUpRight className="h-6 w-6 text-primary" />
          52 Week High
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Stocks approaching their 52-week high • {filtered.length} stocks
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map(f => (
          <Button
            key={f.maxDistance}
            variant={activeFilter === f.maxDistance ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter(f.maxDistance)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
      ) : filtered.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="py-12 text-center text-muted-foreground">
            No stocks found within {activeFilter}% of their 52-week high.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((stock, i) => (
            <motion.div key={stock.symbol} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
              <Link href={`/stock/${stock.symbol}`}>
                <Card className="border-border/50 hover:border-primary/30 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{stock.symbol}</p>
                        <p className="text-xs text-muted-foreground">{stock.companyName}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="font-medium tabular-nums">{formatCurrencyFull(stock.price)}</p>
                        <p className="text-xs text-muted-foreground">52W High: {formatCurrencyFull(stock.weekHigh52)}</p>
                        <Badge variant="outline" className={stock.distance < 1 ? 'border-profit/30 text-profit' : ''}>
                          {stock.distance < 0.01 ? 'AT HIGH' : `${stock.distance.toFixed(2)}% away`}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
