'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getMarketDataProvider } from '@/lib/market-data/provider';
import { NIFTY_50, SECTORS } from '@/lib/data/nifty50';
import { formatCurrencyFull, formatPercent, formatVolume, getPnLColor } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { StockQuote } from '@/lib/market-data/types';
import { Search, ArrowUpDown, Star, BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

type SortField = 'symbol' | 'price' | 'change' | 'changePercent' | 'volume';
type SortDir = 'asc' | 'desc';

export default function Nifty50Page() {
  const [quotes, setQuotes] = useState<StockQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('symbol');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  useEffect(() => {
    const loadData = async () => {
      try {
        const provider = getMarketDataProvider();
        const symbols = NIFTY_50.map((s) => s.symbol);
        const data = await provider.getQuotes(symbols);
        setQuotes(data);
      } catch (error) {
        console.error('Failed to load quotes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredAndSorted = useMemo(() => {
    let result = [...quotes];

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.symbol.toLowerCase().includes(q) ||
          s.companyName.toLowerCase().includes(q)
      );
    }

    // Sector filter
    if (sectorFilter !== 'all') {
      const sectorStocks = NIFTY_50.filter((s) => s.sector === sectorFilter).map((s) => s.symbol);
      result = result.filter((s) => sectorStocks.includes(s.symbol));
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'symbol': cmp = a.symbol.localeCompare(b.symbol); break;
        case 'price': cmp = a.price - b.price; break;
        case 'change': cmp = a.change - b.change; break;
        case 'changePercent': cmp = a.changePercent - b.changePercent; break;
        case 'volume': cmp = a.volume - b.volume; break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [quotes, search, sectorFilter, sortField, sortDir]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir(field === 'symbol' ? 'asc' : 'desc');
    }
  };

  const SortButton = ({ field, label }: { field: SortField; label: string }) => (
    <button
      onClick={() => toggleSort(field)}
      className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
    >
      {label}
      {sortField === field && (
        <ArrowUpDown className="h-3 w-3" />
      )}
    </button>
  );

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            NIFTY 50
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            All 50 NSE blue-chip constituent stocks • Live Market Feed
          </p>
        </div>
        <Badge variant="outline" className="w-fit">
          {filteredAndSorted.length} stocks
        </Badge>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or symbol..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <Select value={sectorFilter} onValueChange={(val) => setSectorFilter(val ?? 'all')}>
          <SelectTrigger className="w-[180px] h-9">
            <SelectValue placeholder="All Sectors" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sectors</SelectItem>
            {SECTORS.map((sector) => (
              <SelectItem key={sector} value={sector}>
                {sector}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stock Table / List */}
      <Card className="border-border/60 overflow-hidden shadow-xs bg-card/60">
        {/* Mobile View: Clean Card List (< md) */}
        <div className="md:hidden divide-y divide-border/40">
          {loading ? (
            <div className="space-y-3 p-3">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          ) : filteredAndSorted.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              <p>No stocks match your search or filter.</p>
            </div>
          ) : (
            filteredAndSorted.map((stock) => {
              const isPositive = stock.change >= 0;
              return (
                <Link key={stock.symbol} href={`/stock/${stock.symbol}`}>
                  <div className="flex items-center justify-between p-3.5 hover:bg-muted/30 transition-colors cursor-pointer active:bg-muted/50">
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-sm tracking-tight text-foreground">{stock.symbol}</p>
                        <Badge variant="secondary" className="text-[9px] py-0 px-1 font-mono text-muted-foreground">
                          NSE:EQ
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate max-w-[190px]">{stock.companyName}</p>
                      <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                        Vol: {formatVolume(stock.volume)} • 52W H: {formatCurrencyFull(stock.weekHigh52)}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-mono font-bold text-sm tabular-nums text-foreground">
                        {formatCurrencyFull(stock.price)}
                      </p>
                      <div
                        className={cn(
                          'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-mono font-semibold mt-0.5',
                          isPositive ? 'bg-profit/15 text-profit' : 'bg-loss/15 text-loss'
                        )}
                      >
                        {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        <span>
                          {isPositive ? '+' : ''}{formatPercent(stock.changePercent)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>

        {/* Tablet, Laptop, and PC Desktop View (>= md) */}
        <div className="hidden md:block overflow-x-auto">
          {/* Header */}
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-2 px-4 py-3 border-b border-border bg-muted/30 min-w-[700px]">
            <SortButton field="symbol" label="Company" />
            <SortButton field="price" label="LTP" />
            <SortButton field="change" label="Change" />
            <SortButton field="changePercent" label="Change %" />
            <SortButton field="volume" label="Volume" />
            <div className="text-xs font-medium text-muted-foreground text-right">52W Range</div>
          </div>

          {/* Rows */}
          <div className="min-w-[700px]">
            {loading ? (
              <div className="divide-y divide-border">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-2 px-4 py-3">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ))}
              </div>
            ) : filteredAndSorted.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <p>No stocks match your search.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filteredAndSorted.map((stock, index) => {
                  return (
                    <motion.div
                      key={stock.symbol}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                    >
                      <Link href={`/stock/${stock.symbol}`}>
                        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-2 px-4 py-3 hover:bg-muted/30 transition-colors cursor-pointer items-center">
                          <div>
                            <p className="text-sm font-semibold">{stock.symbol}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {stock.companyName}
                            </p>
                          </div>
                          <p className="text-sm font-mono font-medium tabular-nums">
                            {formatCurrencyFull(stock.price)}
                          </p>
                          <p className={`text-sm font-mono tabular-nums ${getPnLColor(stock.change)}`}>
                            {stock.change > 0 ? '+' : ''}{formatCurrencyFull(stock.change).replace('₹', '₹')}
                          </p>
                          <div className="flex items-center gap-1 font-mono">
                            {stock.changePercent > 0 ? (
                              <TrendingUp className="h-3 w-3 text-profit" />
                            ) : stock.changePercent < 0 ? (
                              <TrendingDown className="h-3 w-3 text-loss" />
                            ) : null}
                            <span className={`text-sm font-semibold tabular-nums ${getPnLColor(stock.changePercent)}`}>
                              {formatPercent(stock.changePercent)}
                            </span>
                          </div>
                          <p className="text-sm font-mono text-muted-foreground tabular-nums">
                            {formatVolume(stock.volume)}
                          </p>
                          <div className="text-right font-mono">
                            <p className="text-xs text-muted-foreground tabular-nums">
                              H: {formatCurrencyFull(stock.weekHigh52)}
                            </p>
                            <p className="text-xs text-muted-foreground tabular-nums">
                              L: {formatCurrencyFull(stock.weekLow52)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
