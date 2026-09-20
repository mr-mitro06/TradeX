'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTradeXStore } from '@/lib/store';
import { getMarketDataProvider } from '@/lib/market-data/provider';
import { formatCurrencyFull, formatPercent, getPnLColor } from '@/lib/format';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { TrendingUp, TrendingDown, Search } from 'lucide-react';

export function GlobalSearch() {
  const router = useRouter();
  const { searchOpen, setSearchOpen } = useTradeXStore();
  const [results, setResults] = useState<
    Array<{ symbol: string; companyName: string; price?: number; change?: number }>
  >([]);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const provider = getMarketDataProvider();
    const stocks = await provider.searchStocks(query);
    
    // Get quotes for search results
    const enriched = await Promise.all(
      stocks.map(async (s) => {
        try {
          const quote = await provider.getQuote(s.symbol);
          return { ...s, price: quote.price, change: quote.changePercent };
        } catch {
          return s;
        }
      })
    );
    
    setResults(enriched);
  }, []);

  const handleSelect = useCallback(
    (symbol: string) => {
      setSearchOpen(false);
      router.push(`/stock/${symbol}`);
    },
    [router, setSearchOpen]
  );

  return (
    <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
      <CommandInput
        placeholder="Search stocks... (e.g., RELIANCE, TCS, INFY)"
        onValueChange={handleSearch}
      />
      <CommandList>
        <CommandEmpty>
          <div className="flex flex-col items-center gap-2 py-6">
            <Search className="h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No stocks found</p>
          </div>
        </CommandEmpty>
        <CommandGroup heading="Stocks">
          {results.map((stock) => (
            <CommandItem
              key={stock.symbol}
              value={`${stock.symbol} ${stock.companyName}`}
              onSelect={() => handleSelect(stock.symbol)}
              className="flex items-center justify-between py-3 cursor-pointer"
            >
              <div className="flex flex-col">
                <span className="font-medium text-sm">{stock.symbol}</span>
                <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                  {stock.companyName}
                </span>
              </div>
              {stock.price !== undefined && (
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium tabular-nums">
                    {formatCurrencyFull(stock.price)}
                  </span>
                  {stock.change !== undefined && (
                    <span className={`text-xs tabular-nums flex items-center gap-0.5 ${getPnLColor(stock.change)}`}>
                      {stock.change > 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : stock.change < 0 ? (
                        <TrendingDown className="h-3 w-3" />
                      ) : null}
                      {formatPercent(stock.change)}
                    </span>
                  )}
                </div>
              )}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
