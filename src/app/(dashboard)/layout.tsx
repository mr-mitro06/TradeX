'use client';

import { useEffect } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';
import { LiveTickerBar } from '@/components/layout/live-ticker-bar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { GlobalSearch } from '@/components/search/global-search';
import { useTradeXStore } from '@/lib/store';
import type { TradingWallet } from '@/lib/market-data/types';

const DEFAULT_WALLET: TradingWallet = {
  id: 'wallet-tx-94821',
  userId: 'user-tx-94821',
  balance: 250000, // ₹2,50,000 Available Trading Margin
  usedMargin: 0,
  totalDeposited: 250000,
  totalWithdrawn: 0,
  investedAmount: 0,
  totalPortfolioValue: 250000,
  bankAccount: {
    bankName: 'HDFC Bank Ltd.',
    accountNumberMasked: '•••• •••• •••• 8821',
    ifsc: 'HDFC0000060',
    branch: 'Fort Mumbai Branch',
    isVerified: true,
  },
  dematAccount: {
    boId: '12081600 03948215',
    depository: 'CDSL',
    ucc: 'TX94821',
    panMasked: 'ABCDE••••F',
    kycStatus: 'VERIFIED',
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { setWallet, setUserId, wallet } = useTradeXStore();

  useEffect(() => {
    // Initialize authenticated live user and wallet from localStorage
    const savedUser = localStorage.getItem('tradex-user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setUserId(user.id);
    } else {
      setUserId('user-tx-94821');
    }

    // Load wallet from localStorage or use default
    const savedWallet = localStorage.getItem('tradex-wallet');
    if (savedWallet) {
      setWallet(JSON.parse(savedWallet));
    } else {
      setWallet(DEFAULT_WALLET);
      localStorage.setItem('tradex-wallet', JSON.stringify(DEFAULT_WALLET));
    }
  }, [setWallet, setUserId]);

  // Persist wallet changes
  useEffect(() => {
    if (wallet) {
      localStorage.setItem('tradex-wallet', JSON.stringify(wallet));
    }
  }, [wallet]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <LiveTickerBar />
        <Navbar />
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          {children}
        </main>
        <MobileNav />
      </div>
      <GlobalSearch />
    </div>
  );
}
