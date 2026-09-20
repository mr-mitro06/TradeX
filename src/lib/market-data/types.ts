// Market data types for TradeX

export interface StockQuote {
  symbol: string;
  companyName: string;
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  previousClose: number;
  volume: number;
  weekHigh52: number;
  weekLow52: number;
  marketCap: number;
  timestamp: number;
}

export interface OHLCV {
  time: number; // Unix timestamp in seconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type Timeframe = '1m' | '5m' | '15m' | '30m' | '1H' | '4H' | '1D' | '1W' | '1M';

export type ChartType = 'candlestick' | 'line' | 'area';

export type OrderSide = 'BUY' | 'SELL';

export type OrderType = 'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT';

export type ProductType = 'INTRADAY' | 'DELIVERY';

export type OrderStatus =
  | 'PENDING'
  | 'OPEN'
  | 'PARTIALLY_FILLED'
  | 'FILLED'
  | 'CLOSED'
  | 'CANCELLED'
  | 'REJECTED'
  | 'SL_HIT'
  | 'TARGET_HIT';

export interface Order {
  id: string;
  userId: string;
  stockSymbol: string;
  companyName: string;
  side: OrderSide;
  orderType: OrderType;
  productType: ProductType;
  quantity: number;
  price: number;
  triggerPrice?: number;
  stopLoss?: number;
  target?: number;
  status: OrderStatus;
  filledQuantity: number;
  averagePrice: number;
  createdAt: string;
  executedAt?: string;
  closedAt?: string;
}

export interface PortfolioPosition {
  id: string;
  userId: string;
  stockSymbol: string;
  companyName: string;
  productType?: ProductType;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  investedValue: number;
  currentValue: number;
  pnl: number;
  pnlPercent: number;
  stopLoss?: number;
  target?: number;
}

export interface BankAccountDetails {
  bankName: string;
  accountNumberMasked: string;
  ifsc: string;
  branch: string;
  isVerified: boolean;
}

export interface DematAccountDetails {
  boId: string;
  depository: 'CDSL' | 'NSDL';
  ucc: string;
  panMasked: string;
  kycStatus: 'VERIFIED' | 'PENDING' | 'ACTION_REQUIRED';
}

export interface TradingWallet {
  id: string;
  userId: string;
  balance: number; // Available Margin / Cash
  usedMargin?: number;
  totalDeposited: number;
  totalWithdrawn: number;
  investedAmount: number;
  totalPortfolioValue: number;
  bankAccount?: BankAccountDetails;
  dematAccount?: DematAccountDetails;
}

// Backward compatibility alias
export type VirtualWallet = TradingWallet;

export interface Transaction {
  id: string;
  userId: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'BUY' | 'SELL' | 'SL_HIT' | 'TARGET_HIT' | 'BROKERAGE_TAXES' | 'DIVIDEND';
  amount: number;
  description: string;
  createdAt: string;
  referenceId?: string;
  status?: 'COMPLETED' | 'PENDING' | 'FAILED';
  paymentMode?: 'UPI' | 'NET_BANKING' | 'NEFT' | 'INTERNAL';
}

export interface MarketDepthItem {
  price: number;
  orders: number;
  quantity: number;
}

export interface MarketDepth {
  bids: MarketDepthItem[];
  asks: MarketDepthItem[];
  totalBuyQuantity: number;
  totalSellQuantity: number;
}

export interface WatchlistItem {
  id: string;
  userId: string;
  stockSymbol: string;
  createdAt: string;
}

export interface MarketStatus {
  isOpen: boolean;
  exchange: string;
  openTime: string;
  closeTime: string;
  nextOpenTime?: string;
}

// Market Data Provider Interface
export interface MarketDataProvider {
  getQuote(symbol: string): Promise<StockQuote>;
  getQuotes(symbols: string[]): Promise<StockQuote[]>;
  getHistoricalData(symbol: string, timeframe: Timeframe, from?: number, to?: number): Promise<OHLCV[]>;
  getMarketStatus(): MarketStatus;
  searchStocks(query: string): Promise<Array<{ symbol: string; companyName: string }>>;
}
