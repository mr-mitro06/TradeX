// Market Data Provider Factory
// Abstracts the market data source so it can be swapped later

import { SimulatedMarketDataProvider } from './simulated';
import type { MarketDataProvider } from './types';

export type ProviderType = 'simulated' | 'twelvedata';

let providerInstance: MarketDataProvider | null = null;

export function getMarketDataProvider(): MarketDataProvider {
  if (providerInstance) return providerInstance;

  // For now, always use simulated provider
  // When MARKET_DATA_PROVIDER env var is set to 'twelvedata' and
  // MARKET_DATA_API_KEY is provided, it could switch to real data
  providerInstance = new SimulatedMarketDataProvider();
  
  return providerInstance;
}

export function resetProvider(): void {
  providerInstance = null;
}
