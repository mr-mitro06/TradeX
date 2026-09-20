# TradeX — Live Stock Trading & Demat Platform (NSE India)

TradeX is a modern, Web3-inspired live equity trading and demat application designed for the Indian Stock Market (NSE). It provides real-time streaming market prices, multi-product order execution (CNC / MIS), live Level 2 market depth, TradingView-style candlestick charting, regulatory charges and taxes breakdown, and responsive interfaces optimized across mobile phones, tablets, laptops, and ultra-wide desktop monitors.

---

## 🚀 Key Features

### 1. Live Market Data & NIFTY 50 Blue-Chips
- **Real-Time Streaming Ticks**: Live price simulations reflecting realistic volatility and price action.
- **Complete NIFTY 50 Coverage**: Track Reliance, TCS, HDFC Bank, Infosys, ICICI Bank, and the rest of India's index leaders.
- **Categorized Discovery**:
  - Top 52-Week High Breakout Stocks.
  - High-Performance intraday leaders and sector movers.
  - Custom Watchlist with quick-toggle tracking.

### 2. Professional Order Execution
- **Product Types**:
  - `CNC` (Cash 'n' Carry for long-term equity delivery).
  - `MIS` (Margin Intraday Settlement with 5x margin leverage).
- **Order Types**:
  - `Market Order` (Instant execution at best bid/ask).
  - `Limit Order` (Fill at exact target price).
  - `Stop-Loss Order (SL)` (Triggered risk protection).
  - `Target Price (Take-Profit)` (Automated profit-taking exits).

### 3. Real Indian Statutory Charges & Taxes Calculator
- Displays upfront exchange and government charges on every order:
  - **Securities Transaction Tax (STT)**: 0.1% on delivery / 0.025% on intraday.
  - **Brokerage**: ₹20 flat or 0.03% (whichever is lower).
  - **Exchange Transaction Fee**: 0.00297% (NSE).
  - **SEBI Turnover Charges**: ₹10 per crore.
  - **Stamp Duty**: 0.015% on buy side.
  - **Goods and Services Tax (GST)**: 18% on brokerage & transaction charges.

### 4. Market Depth (Level 2 Order Book)
- 5-level real-time bid and ask queue with volume bars, cumulative depth totals, and spread indicators.

### 5. Demat Portfolio & Funds Management
- **Live Positions**: Real-time unrealized P&L, day change, and one-click square off.
- **Holdings**: Average buy price, current valuation, overall returns (₹ & %).
- **Fund Balances**: Instant deposit / withdrawal, live margin utilization, and collateral tracking.

### 6. Multi-Device Responsive Design
- **Mobile First**: Fixed bottom navigation, floating quick BUY/SELL order trigger, thumb-friendly touch targets.
- **Laptops & Desktops**: Side-by-side candlestick charts, responsive multi-column layouts, Level 2 depth, and keyboard-navigable global search (`Ctrl+K` / `⌘K`).
- **Minimalist Themes**: High-contrast Dark Mode (Web3 aesthetic) and Clean Light Mode.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (Turbopack, App Router)](https://nextjs.org/)
- **UI Components**: Modern Tailwind CSS v4 & Base UI / Radix Primitives
- **Charts**: Lightweight Candlestick and Technical Charts
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) with localStorage persistence (100% client-side, zero database configuration needed)
- **Icons & Animations**: Lucide React & Framer Motion
- **Hosting**: GitHub Pages (Static Export via GitHub Actions)

---

## 💻 Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/mr-mitro06/TradeX.git
   cd TradeX
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local dev server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000).

5. **Build Static Export**:
   ```bash
   npm run build
   ```
   The production static assets will be compiled into the `out/` folder.

---

## 🌐 Deploying to GitHub Pages

This project is configured with a GitHub Actions workflow (`.github/workflows/deploy.yml`) for continuous deployment.

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "feat: TradeX live stock trading platform"
   git push origin main
   ```
2. In your repository on GitHub:
   - Go to **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. The workflow will automatically trigger on push and publish your site to:
   `https://<your-username>.github.io/TradeX/`

---

## 📄 License

MIT License. Designed for education, trading simulation, and market analytics.
