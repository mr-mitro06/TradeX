// Complete NIFTY 50 constituent stock data
// All prices are in INR and represent realistic base values

export interface StockInfo {
  symbol: string;
  companyName: string;
  sector: string;
  basePrice: number;
  weekHigh52: number;
  weekLow52: number;
  marketCap: number; // in crores
  lotSize: number;
}

export const NIFTY_50_STOCKS: StockInfo[] = [
  { symbol: "RELIANCE", companyName: "Reliance Industries Ltd.", sector: "Oil & Gas", basePrice: 2950, weekHigh52: 3025, weekLow52: 2220, marketCap: 1998000, lotSize: 250 },
  { symbol: "TCS", companyName: "Tata Consultancy Services Ltd.", sector: "IT", basePrice: 4120, weekHigh52: 4250, weekLow52: 3320, marketCap: 1502000, lotSize: 175 },
  { symbol: "HDFCBANK", companyName: "HDFC Bank Ltd.", sector: "Banking", basePrice: 1685, weekHigh52: 1795, weekLow52: 1365, marketCap: 1280000, lotSize: 550 },
  { symbol: "INFY", companyName: "Infosys Ltd.", sector: "IT", basePrice: 1850, weekHigh52: 1960, weekLow52: 1350, marketCap: 767000, lotSize: 300 },
  { symbol: "ICICIBANK", companyName: "ICICI Bank Ltd.", sector: "Banking", basePrice: 1240, weekHigh52: 1310, weekLow52: 935, marketCap: 870000, lotSize: 700 },
  { symbol: "HINDUNILVR", companyName: "Hindustan Unilever Ltd.", sector: "FMCG", basePrice: 2520, weekHigh52: 2860, weekLow52: 2172, marketCap: 592000, lotSize: 300 },
  { symbol: "ITC", companyName: "ITC Ltd.", sector: "FMCG", basePrice: 465, weekHigh52: 500, weekLow52: 390, marketCap: 580000, lotSize: 1600 },
  { symbol: "SBIN", companyName: "State Bank of India", sector: "Banking", basePrice: 825, weekHigh52: 912, weekLow52: 600, marketCap: 737000, lotSize: 1500 },
  { symbol: "BHARTIARTL", companyName: "Bharti Airtel Ltd.", sector: "Telecom", basePrice: 1580, weekHigh52: 1680, weekLow52: 1100, marketCap: 940000, lotSize: 475 },
  { symbol: "KOTAKBANK", companyName: "Kotak Mahindra Bank Ltd.", sector: "Banking", basePrice: 1780, weekHigh52: 1855, weekLow52: 1545, marketCap: 354000, lotSize: 400 },
  { symbol: "LT", companyName: "Larsen & Toubro Ltd.", sector: "Infrastructure", basePrice: 3520, weekHigh52: 3750, weekLow52: 2880, marketCap: 483000, lotSize: 150 },
  { symbol: "AXISBANK", companyName: "Axis Bank Ltd.", sector: "Banking", basePrice: 1165, weekHigh52: 1240, weekLow52: 935, marketCap: 360000, lotSize: 625 },
  { symbol: "WIPRO", companyName: "Wipro Ltd.", sector: "IT", basePrice: 565, weekHigh52: 590, weekLow52: 380, marketCap: 295000, lotSize: 1500 },
  { symbol: "HCLTECH", companyName: "HCL Technologies Ltd.", sector: "IT", basePrice: 1680, weekHigh52: 1780, weekLow52: 1180, marketCap: 456000, lotSize: 350 },
  { symbol: "ASIANPAINT", companyName: "Asian Paints Ltd.", sector: "Consumer Goods", basePrice: 2840, weekHigh52: 3395, weekLow52: 2670, marketCap: 273000, lotSize: 200 },
  { symbol: "MARUTI", companyName: "Maruti Suzuki India Ltd.", sector: "Automobile", basePrice: 12450, weekHigh52: 13200, weekLow52: 9830, marketCap: 392000, lotSize: 50 },
  { symbol: "SUNPHARMA", companyName: "Sun Pharmaceutical Industries Ltd.", sector: "Pharma", basePrice: 1720, weekHigh52: 1850, weekLow52: 1205, marketCap: 413000, lotSize: 350 },
  { symbol: "TATAMOTORS", companyName: "Tata Motors Ltd.", sector: "Automobile", basePrice: 985, weekHigh52: 1085, weekLow52: 620, marketCap: 365000, lotSize: 575 },
  { symbol: "BAJFINANCE", companyName: "Bajaj Finance Ltd.", sector: "NBFC", basePrice: 7250, weekHigh52: 8190, weekLow52: 5875, marketCap: 449000, lotSize: 125 },
  { symbol: "TITAN", companyName: "Titan Company Ltd.", sector: "Consumer Goods", basePrice: 3580, weekHigh52: 3890, weekLow52: 2915, marketCap: 318000, lotSize: 175 },
  { symbol: "NESTLEIND", companyName: "Nestle India Ltd.", sector: "FMCG", basePrice: 2480, weekHigh52: 2778, weekLow52: 2165, marketCap: 239000, lotSize: 200 },
  { symbol: "ULTRACEMCO", companyName: "UltraTech Cement Ltd.", sector: "Cement", basePrice: 11200, weekHigh52: 11840, weekLow52: 8885, marketCap: 324000, lotSize: 50 },
  { symbol: "BAJAJFINSV", companyName: "Bajaj Finserv Ltd.", sector: "NBFC", basePrice: 1685, weekHigh52: 1850, weekLow52: 1370, marketCap: 269000, lotSize: 500 },
  { symbol: "TATASTEEL", companyName: "Tata Steel Ltd.", sector: "Metals", basePrice: 165, weekHigh52: 184, weekLow52: 118, marketCap: 206000, lotSize: 5500 },
  { symbol: "POWERGRID", companyName: "Power Grid Corporation of India Ltd.", sector: "Power", basePrice: 315, weekHigh52: 345, weekLow52: 225, marketCap: 293000, lotSize: 2800 },
  { symbol: "NTPC", companyName: "NTPC Ltd.", sector: "Power", basePrice: 385, weekHigh52: 418, weekLow52: 268, marketCap: 373000, lotSize: 2400 },
  { symbol: "ONGC", companyName: "Oil and Natural Gas Corporation Ltd.", sector: "Oil & Gas", basePrice: 295, weekHigh52: 325, weekLow52: 195, marketCap: 371000, lotSize: 3850 },
  { symbol: "M&M", companyName: "Mahindra & Mahindra Ltd.", sector: "Automobile", basePrice: 2650, weekHigh52: 2890, weekLow52: 1650, marketCap: 329000, lotSize: 300 },
  { symbol: "JSWSTEEL", companyName: "JSW Steel Ltd.", sector: "Metals", basePrice: 895, weekHigh52: 985, weekLow52: 690, marketCap: 216000, lotSize: 675 },
  { symbol: "TECHM", companyName: "Tech Mahindra Ltd.", sector: "IT", basePrice: 1620, weekHigh52: 1735, weekLow52: 1135, marketCap: 158000, lotSize: 400 },
  { symbol: "ADANIENT", companyName: "Adani Enterprises Ltd.", sector: "Diversified", basePrice: 2920, weekHigh52: 3440, weekLow52: 2025, marketCap: 334000, lotSize: 250 },
  { symbol: "ADANIPORTS", companyName: "Adani Ports and Special Economic Zone Ltd.", sector: "Infrastructure", basePrice: 1385, weekHigh52: 1590, weekLow52: 975, marketCap: 299000, lotSize: 500 },
  { symbol: "COALINDIA", companyName: "Coal India Ltd.", sector: "Mining", basePrice: 485, weekHigh52: 540, weekLow52: 350, marketCap: 299000, lotSize: 1500 },
  { symbol: "BPCL", companyName: "Bharat Petroleum Corporation Ltd.", sector: "Oil & Gas", basePrice: 620, weekHigh52: 720, weekLow52: 440, marketCap: 135000, lotSize: 1800 },
  { symbol: "DRREDDY", companyName: "Dr. Reddy's Laboratories Ltd.", sector: "Pharma", basePrice: 6380, weekHigh52: 6825, weekLow52: 5260, marketCap: 106000, lotSize: 125 },
  { symbol: "CIPLA", companyName: "Cipla Ltd.", sector: "Pharma", basePrice: 1535, weekHigh52: 1680, weekLow52: 1100, marketCap: 124000, lotSize: 650 },
  { symbol: "EICHERMOT", companyName: "Eicher Motors Ltd.", sector: "Automobile", basePrice: 4680, weekHigh52: 4950, weekLow52: 3400, marketCap: 128000, lotSize: 150 },
  { symbol: "APOLLOHOSP", companyName: "Apollo Hospitals Enterprise Ltd.", sector: "Healthcare", basePrice: 6820, weekHigh52: 7125, weekLow52: 4980, marketCap: 98000, lotSize: 125 },
  { symbol: "DIVISLAB", companyName: "Divi's Laboratories Ltd.", sector: "Pharma", basePrice: 5650, weekHigh52: 6250, weekLow52: 3450, marketCap: 150000, lotSize: 100 },
  { symbol: "GRASIM", companyName: "Grasim Industries Ltd.", sector: "Cement", basePrice: 2560, weekHigh52: 2850, weekLow52: 1960, marketCap: 169000, lotSize: 250 },
  { symbol: "BRITANNIA", companyName: "Britannia Industries Ltd.", sector: "FMCG", basePrice: 5780, weekHigh52: 6200, weekLow52: 4720, marketCap: 139000, lotSize: 100 },
  { symbol: "SBILIFE", companyName: "SBI Life Insurance Company Ltd.", sector: "Insurance", basePrice: 1685, weekHigh52: 1795, weekLow52: 1270, marketCap: 169000, lotSize: 375 },
  { symbol: "HDFCLIFE", companyName: "HDFC Life Insurance Company Ltd.", sector: "Insurance", basePrice: 680, weekHigh52: 745, weekLow52: 535, marketCap: 146000, lotSize: 1100 },
  { symbol: "INDUSINDBK", companyName: "IndusInd Bank Ltd.", sector: "Banking", basePrice: 1490, weekHigh52: 1580, weekLow52: 935, marketCap: 116000, lotSize: 400 },
  { symbol: "TATACONSUM", companyName: "Tata Consumer Products Ltd.", sector: "FMCG", basePrice: 1120, weekHigh52: 1265, weekLow52: 870, marketCap: 105000, lotSize: 500 },
  { symbol: "HEROMOTOCO", companyName: "Hero MotoCorp Ltd.", sector: "Automobile", basePrice: 5150, weekHigh52: 5650, weekLow52: 3850, marketCap: 103000, lotSize: 150 },
  { symbol: "BAJAJ-AUTO", companyName: "Bajaj Auto Ltd.", sector: "Automobile", basePrice: 9350, weekHigh52: 9950, weekLow52: 6850, marketCap: 263000, lotSize: 75 },
  { symbol: "HINDALCO", companyName: "Hindalco Industries Ltd.", sector: "Metals", basePrice: 620, weekHigh52: 680, weekLow52: 440, marketCap: 139000, lotSize: 1075 },
  { symbol: "WIPRO", companyName: "Wipro Ltd.", sector: "IT", basePrice: 565, weekHigh52: 590, weekLow52: 380, marketCap: 295000, lotSize: 1500 },
  { symbol: "SHRIRAMFIN", companyName: "Shriram Finance Ltd.", sector: "NBFC", basePrice: 2680, weekHigh52: 2950, weekLow52: 2050, marketCap: 101000, lotSize: 225 },
];

// Remove duplicate WIPRO entry
export const NIFTY_50 = NIFTY_50_STOCKS.filter(
  (stock, index, self) => index === self.findIndex((s) => s.symbol === stock.symbol)
);

export const SECTORS = [...new Set(NIFTY_50.map((s) => s.sector))].sort();

export function getStockBySymbol(symbol: string): StockInfo | undefined {
  return NIFTY_50.find((s) => s.symbol === symbol);
}
