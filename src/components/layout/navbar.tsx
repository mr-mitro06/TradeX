'use client';

import { useTradeXStore } from '@/lib/store';
import { formatCurrencyFull } from '@/lib/format';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, Wallet, LogOut, User, Settings, Star, ArrowUpRight, Zap } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getMarketDataProvider } from '@/lib/market-data/provider';

function MarketStatusIndicator() {
  const provider = getMarketDataProvider();
  const status = provider.getMarketStatus();

  return (
    <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-secondary/50 text-[11px]">
      <div className={`w-2 h-2 rounded-full ${status.isOpen ? 'bg-profit animate-pulse' : 'bg-muted-foreground'}`} />
      <span className="font-medium text-foreground">
        {status.exchange} {status.isOpen ? 'OPEN' : 'CLOSED'}
      </span>
    </div>
  );
}

export function Navbar() {
  const { wallet, setSearchOpen } = useTradeXStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Keyboard shortcut for search
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSearchOpen]);

  return (
    <header className="flex items-center justify-between h-14 px-3 sm:px-4 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-40">
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Brand Logo */}
        <Link href="/" className="md:hidden flex items-center gap-2 shrink-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground font-bold text-xs shadow-xs">
            TX
          </div>
          <span className="font-bold text-sm tracking-tight text-foreground hidden xs:inline">TradeX</span>
        </Link>

        {/* Desktop Search Trigger */}
        <Button
          variant="outline"
          onClick={() => setSearchOpen(true)}
          className="hidden sm:flex items-center gap-2 h-9 px-3 text-muted-foreground text-xs sm:w-56 md:w-64 justify-start cursor-pointer hover:border-primary/40"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Search stocks (e.g. RELIANCE)...</span>
          <kbd className="ml-auto text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono">
            ⌘K
          </kbd>
        </Button>

        {/* Mobile Search Icon Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSearchOpen(true)}
          className="sm:hidden h-8 w-8 text-muted-foreground cursor-pointer"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <MarketStatusIndicator />

        {/* Available Trading Margin */}
        {mounted && wallet && (
          <Link href="/funds">
            {/* Desktop / Laptop */}
            <Button variant="ghost" className="hidden sm:flex items-center gap-1.5 h-9 px-2.5 text-xs hover:bg-muted cursor-pointer">
              <Wallet className="h-3.5 w-3.5 text-primary" />
              <span className="font-mono font-semibold tabular-nums text-foreground">
                {formatCurrencyFull(wallet.balance)}
              </span>
            </Button>

            {/* Mobile compact margin pill */}
            <Button
              variant="outline"
              size="sm"
              className="sm:hidden flex items-center gap-1 h-7 px-2 text-[11px] font-mono font-bold border-primary/30 text-primary bg-primary/5 cursor-pointer"
            >
              <Wallet className="h-3 w-3" />
              <span>₹{(wallet.balance / 100000).toFixed(2)}L</span>
            </Button>
          </Link>
        )}

        <ThemeToggle />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'icon' }),
              'h-8 w-8 sm:h-9 sm:w-9 rounded-full cursor-pointer'
            )}
          >
            <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                TX
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            {/* Mobile Extra Navigation Links */}
            <div className="md:hidden border-b border-border/40 pb-1 mb-1">
              <DropdownMenuItem className="p-0">
                <Link href="/watchlist" className="flex items-center gap-2 w-full px-2 py-1.5 cursor-pointer">
                  <Star className="h-4 w-4 text-amber-400" />
                  Watchlist
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-0">
                <Link href="/52w-high" className="flex items-center gap-2 w-full px-2 py-1.5 cursor-pointer">
                  <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                  52-Week High
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-0">
                <Link href="/high-performance" className="flex items-center gap-2 w-full px-2 py-1.5 cursor-pointer">
                  <Zap className="h-4 w-4 text-primary" />
                  High Performance
                </Link>
              </DropdownMenuItem>
            </div>

            <DropdownMenuItem className="p-0">
              <Link href="/settings" className="flex items-center gap-2 w-full px-2 py-1.5 cursor-pointer">
                <User className="h-4 w-4" />
                Demat Profile & UCC
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-0">
              <Link href="/settings" className="flex items-center gap-2 w-full px-2 py-1.5 cursor-pointer">
                <Settings className="h-4 w-4" />
                Settings & 2FA
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 text-destructive cursor-pointer">
              <LogOut className="h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
