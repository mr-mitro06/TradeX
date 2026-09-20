// Global application store using Zustand

import { create } from 'zustand';
import type { StockQuote, VirtualWallet, Order, PortfolioPosition, WatchlistItem } from '@/lib/market-data/types';

interface TradeXStore {
  // User state
  userId: string | null;
  setUserId: (id: string | null) => void;

  // Wallet
  wallet: VirtualWallet | null;
  setWallet: (wallet: VirtualWallet | null) => void;

  // Market data
  quotes: Map<string, StockQuote>;
  updateQuote: (quote: StockQuote) => void;
  updateQuotes: (quotes: StockQuote[]) => void;

  // Portfolio
  positions: PortfolioPosition[];
  setPositions: (positions: PortfolioPosition[]) => void;

  // Orders
  orders: Order[];
  setOrders: (orders: Order[]) => void;

  // Watchlist
  watchlist: WatchlistItem[];
  setWatchlist: (watchlist: WatchlistItem[]) => void;
  isWatched: (symbol: string) => boolean;

  // UI state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
}

export const useTradeXStore = create<TradeXStore>((set, get) => ({
  // User
  userId: null,
  setUserId: (id) => set({ userId: id }),

  // Wallet
  wallet: null,
  setWallet: (wallet) => set({ wallet }),

  // Market data
  quotes: new Map(),
  updateQuote: (quote) =>
    set((state) => {
      const newQuotes = new Map(state.quotes);
      newQuotes.set(quote.symbol, quote);
      return { quotes: newQuotes };
    }),
  updateQuotes: (quotes) =>
    set((state) => {
      const newQuotes = new Map(state.quotes);
      quotes.forEach((q) => newQuotes.set(q.symbol, q));
      return { quotes: newQuotes };
    }),

  // Portfolio
  positions: [],
  setPositions: (positions) => set({ positions }),

  // Orders
  orders: [],
  setOrders: (orders) => set({ orders }),

  // Watchlist
  watchlist: [],
  setWatchlist: (watchlist) => set({ watchlist }),
  isWatched: (symbol) => get().watchlist.some((w) => w.stockSymbol === symbol),

  // UI
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  searchOpen: false,
  setSearchOpen: (open) => set({ searchOpen: open }),
}));
