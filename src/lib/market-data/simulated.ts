// Simulated Market Data Provider
// Generates realistic OHLCV data using random walks with mean reversion

import { NIFTY_50, type StockInfo } from '@/lib/data/nifty50';
import type { MarketDataProvider, StockQuote, OHLCV, Timeframe, MarketStatus } from './types';

// Deterministic seed-based random for consistent prices across renders
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Get current simulated price for a stock based on time
function getSimulatedPrice(stock: StockInfo, timestamp: number): number {
  const seed = hashString(stock.symbol) + Math.floor(timestamp / 5000); // Updates every 5 seconds
  const dailySeed = hashString(stock.symbol) + Math.floor(timestamp / 86400000);
  
  // Daily trend component (mean-reverting random walk)
  const dayOfYear = Math.floor(timestamp / 86400000) % 365;
  let trendAccumulator = 0;
  for (let i = 0; i < dayOfYear % 30; i++) {
    const r = seededRandom(dailySeed + i) - 0.48; // Slight upward bias
    trendAccumulator += r * 0.008;
  }
  trendAccumulator = Math.max(-0.15, Math.min(0.15, trendAccumulator)); // Cap at ±15%
  
  // Intraday volatility
  const intradayNoise = (seededRandom(seed) - 0.5) * 0.02; // ±1%
  const intradayNoise2 = (seededRandom(seed + 1) - 0.5) * 0.005; // Additional small noise
  
  // Time-of-day pattern (higher volatility at open/close)
  const date = new Date(timestamp);
  const hours = date.getHours() + date.getMinutes() / 60;
  let timeEffect = 0;
  if (hours >= 9.25 && hours <= 15.5) {
    const marketProgress = (hours - 9.25) / 6.25; // 0 to 1
    // U-shaped volatility curve
    timeEffect = (seededRandom(seed + 2) - 0.5) * 0.005 * (1 + 2 * Math.pow(2 * marketProgress - 1, 2));
  }
  
  const priceMultiplier = 1 + trendAccumulator + intradayNoise + intradayNoise2 + timeEffect;
  return Math.round(stock.basePrice * priceMultiplier * 100) / 100;
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function generateOHLCV(stock: StockInfo, startTime: number, intervalMs: number): OHLCV {
  const open = getSimulatedPrice(stock, startTime);
  const mid = getSimulatedPrice(stock, startTime + intervalMs * 0.5);
  const close = getSimulatedPrice(stock, startTime + intervalMs);
  
  const prices = [open, mid, close];
  const seed = hashString(stock.symbol) + Math.floor(startTime / intervalMs);
  const extraHigh = Math.max(...prices) * (1 + seededRandom(seed + 10) * 0.005);
  const extraLow = Math.min(...prices) * (1 - seededRandom(seed + 11) * 0.005);
  
  const baseVolume = stock.marketCap > 500000 ? 5000000 : stock.marketCap > 200000 ? 2000000 : 800000;
  const volume = Math.floor(baseVolume * (0.5 + seededRandom(seed + 20) * 1.5));
  
  return {
    time: Math.floor(startTime / 1000),
    open: Math.round(open * 100) / 100,
    high: Math.round(extraHigh * 100) / 100,
    low: Math.round(extraLow * 100) / 100,
    close: Math.round(close * 100) / 100,
    volume,
  };
}

const TIMEFRAME_MS: Record<Timeframe, number> = {
  '1m': 60 * 1000,
  '5m': 5 * 60 * 1000,
  '15m': 15 * 60 * 1000,
  '30m': 30 * 60 * 1000,
  '1H': 60 * 60 * 1000,
  '4H': 4 * 60 * 60 * 1000,
  '1D': 24 * 60 * 60 * 1000,
  '1W': 7 * 24 * 60 * 60 * 1000,
  '1M': 30 * 24 * 60 * 60 * 1000,
};

const TIMEFRAME_BARS: Record<Timeframe, number> = {
  '1m': 390,   // ~1 trading day
  '5m': 390,   // ~5 trading days
  '15m': 390,  // ~15 trading days
  '30m': 260,  // ~1 month
  '1H': 260,   // ~2 months
  '4H': 260,   // ~6 months
  '1D': 365,   // 1 year
  '1W': 104,   // 2 years
  '1M': 60,    // 5 years
};

export class SimulatedMarketDataProvider implements MarketDataProvider {
  async getQuote(symbol: string): Promise<StockQuote> {
    const stock = NIFTY_50.find(s => s.symbol === symbol);
    if (!stock) {
      throw new Error(`Stock not found: ${symbol}`);
    }
    
    const now = Date.now();
    const price = getSimulatedPrice(stock, now);
    const previousClose = getSimulatedPrice(stock, now - 86400000);
    const change = Math.round((price - previousClose) * 100) / 100;
    const changePercent = Math.round((change / previousClose) * 10000) / 100;
    
    const todayOpen = getSimulatedPrice(stock, now - (now % 86400000) + 9.25 * 3600000);
    const seed = hashString(symbol) + Math.floor(now / 86400000);
    
    return {
      symbol: stock.symbol,
      companyName: stock.companyName,
      price,
      change,
      changePercent,
      open: todayOpen,
      high: Math.max(price, todayOpen) * (1 + seededRandom(seed + 30) * 0.01),
      low: Math.min(price, todayOpen) * (1 - seededRandom(seed + 31) * 0.01),
      previousClose,
      volume: Math.floor(3000000 * (0.5 + seededRandom(seed + 40) * 1.5)),
      weekHigh52: stock.weekHigh52,
      weekLow52: stock.weekLow52,
      marketCap: stock.marketCap,
      timestamp: now,
    };
  }

  async getQuotes(symbols: string[]): Promise<StockQuote[]> {
    return Promise.all(symbols.map(s => this.getQuote(s)));
  }

  async getHistoricalData(
    symbol: string,
    timeframe: Timeframe,
    from?: number,
    to?: number
  ): Promise<OHLCV[]> {
    const stock = NIFTY_50.find(s => s.symbol === symbol);
    if (!stock) {
      throw new Error(`Stock not found: ${symbol}`);
    }
    
    const intervalMs = TIMEFRAME_MS[timeframe];
    const numBars = TIMEFRAME_BARS[timeframe];
    const endTime = to ? to * 1000 : Date.now();
    const startTime = from ? from * 1000 : endTime - (numBars * intervalMs);
    
    const bars: OHLCV[] = [];
    let currentTime = startTime;
    
    while (currentTime < endTime && bars.length < numBars) {
      bars.push(generateOHLCV(stock, currentTime, intervalMs));
      currentTime += intervalMs;
    }
    
    return bars;
  }

  getMarketStatus(): MarketStatus {
    const now = new Date();
    const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const hours = ist.getHours();
    const minutes = ist.getMinutes();
    const day = ist.getDay();
    const timeInMinutes = hours * 60 + minutes;
    
    // NSE: Mon-Fri, 9:15 AM to 3:30 PM IST
    const isWeekday = day >= 1 && day <= 5;
    const isMarketHours = timeInMinutes >= 555 && timeInMinutes <= 930; // 9:15 = 555, 15:30 = 930
    
    return {
      isOpen: isWeekday && isMarketHours,
      exchange: 'NSE',
      openTime: '9:15 AM',
      closeTime: '3:30 PM',
    };
  }

  async searchStocks(query: string): Promise<Array<{ symbol: string; companyName: string }>> {
    const q = query.toLowerCase();
    return NIFTY_50
      .filter(s => 
        s.symbol.toLowerCase().includes(q) || 
        s.companyName.toLowerCase().includes(q)
      )
      .map(s => ({ symbol: s.symbol, companyName: s.companyName }))
      .slice(0, 10);
  }
}
