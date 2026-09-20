'use client';

import { useMemo } from 'react';
import { formatCurrencyFull } from '@/lib/format';

interface MarketDepthProps {
  price: number;
}

export function MarketDepth({ price }: MarketDepthProps) {
  // Generate realistic 5-level Bid/Ask book centered around current price
  const { bids, asks, totalBidQty, totalAskQty } = useMemo(() => {
    const tick = 0.05;
    const bidsData = [
      { price: Math.round((price - tick * 1) * 100) / 100, orders: 18, qty: 1420 },
      { price: Math.round((price - tick * 2) * 100) / 100, orders: 34, qty: 3850 },
      { price: Math.round((price - tick * 3) * 100) / 100, orders: 27, qty: 2910 },
      { price: Math.round((price - tick * 4) * 100) / 100, orders: 52, qty: 6100 },
      { price: Math.round((price - tick * 5) * 100) / 100, orders: 41, qty: 4500 },
    ];

    const asksData = [
      { price: Math.round((price + tick * 1) * 100) / 100, orders: 15, qty: 1150 },
      { price: Math.round((price + tick * 2) * 100) / 100, orders: 29, qty: 2800 },
      { price: Math.round((price + tick * 3) * 100) / 100, orders: 45, qty: 5200 },
      { price: Math.round((price + tick * 4) * 100) / 100, orders: 31, qty: 3400 },
      { price: Math.round((price + tick * 5) * 100) / 100, orders: 38, qty: 4100 },
    ];

    const totalBids = bidsData.reduce((acc, curr) => acc + curr.qty, 0);
    const totalAsks = asksData.reduce((acc, curr) => acc + curr.qty, 0);

    return {
      bids: bidsData,
      asks: asksData,
      totalBidQty: totalBids,
      totalAskQty: totalAsks,
    };
  }, [price]);

  const bidRatio = Math.round((totalBidQty / (totalBidQty + totalAskQty)) * 100);
  const askRatio = 100 - bidRatio;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="text-emerald-500">Bid (Buyers)</span>
        <span className="text-muted-foreground font-mono">Level 2 Depth</span>
        <span className="text-rose-500">Ask (Sellers)</span>
      </div>

      {/* Buyer vs Seller Ratio Bar */}
      <div className="space-y-1">
        <div className="h-1.5 w-full rounded-full flex overflow-hidden bg-muted">
          <div className="bg-emerald-500 transition-all duration-300" style={{ width: `${bidRatio}%` }} />
          <div className="bg-rose-500 transition-all duration-300" style={{ width: `${askRatio}%` }} />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
          <span>{bidRatio}% ({totalBidQty.toLocaleString('en-IN')})</span>
          <span>{askRatio}% ({totalAskQty.toLocaleString('en-IN')})</span>
        </div>
      </div>

      {/* 5-Level Depth Table */}
      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
        {/* Bids side */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-muted-foreground font-sans px-1 pb-0.5 border-b border-border/40">
            <span>Orders</span>
            <span>Qty</span>
            <span>Bid Price</span>
          </div>
          {bids.map((b, i) => (
            <div key={i} className="flex justify-between items-center px-1 py-0.5 rounded bg-emerald-500/5">
              <span className="text-muted-foreground">{b.orders}</span>
              <span className="text-foreground">{b.qty.toLocaleString('en-IN')}</span>
              <span className="text-emerald-500 font-semibold">{formatCurrencyFull(b.price)}</span>
            </div>
          ))}
        </div>

        {/* Asks side */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-muted-foreground font-sans px-1 pb-0.5 border-b border-border/40">
            <span>Ask Price</span>
            <span>Qty</span>
            <span>Orders</span>
          </div>
          {asks.map((a, i) => (
            <div key={i} className="flex justify-between items-center px-1 py-0.5 rounded bg-rose-500/5">
              <span className="text-rose-500 font-semibold">{formatCurrencyFull(a.price)}</span>
              <span className="text-foreground">{a.qty.toLocaleString('en-IN')}</span>
              <span className="text-muted-foreground">{a.orders}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
