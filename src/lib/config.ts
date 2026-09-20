// Environment configuration
// IMPORTANT: Never expose secret keys in client-side code

export const config = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  },
  marketData: {
    provider: (process.env.MARKET_DATA_PROVIDER || 'simulated') as 'simulated' | 'twelvedata',
    apiKey: process.env.MARKET_DATA_API_KEY || '',
  },
  trading: {
    initialBalance: Number(process.env.INITIAL_VIRTUAL_BALANCE) || 100000,
    currency: '₹',
    currencyCode: 'INR',
    exchange: 'NSE',
  },
};
