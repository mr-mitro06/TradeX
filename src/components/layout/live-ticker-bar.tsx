'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IndexItem {
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

const INITIAL_INDICES: IndexItem[] = [
  { name: 'NIFTY 50', value: 24835.40, change: 142.30, changePercent: 0.58 },
  { name: 'SENSEX', value: 81420.15, change: 485.60, changePercent: 0.60 },
  { name: 'BANK NIFTY', value: 51240.80, change: 290.40, changePercent: 0.57 },
  { name: 'NIFTY IT', value: 36195.20, change: -110.50, changePercent: -0.30 },
  { name: 'INDIA VIX', value: 13.25, change: -0.42, changePercent: -3.07 },
  { name: 'NIFTY AUTO', value: 25680.10, change: 185.20, changePercent: 0.73 },
];

export function LiveTickerBar() {
  const [indices, setIndices] = useState<IndexItem[]>(INITIAL_INDICES);
  const [lastTick, setLastTick] = useState<number>(Date.now());

  // Simulate real live market tick micro-movements every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndices((prev) =>
        prev.map((item) => {
          const delta = (Math.random() - 0.48) * (item.name === 'INDIA VIX' ? 0.08 : 4.5);
          const newValue = Math.round((item.value + delta) * 100) / 100;
          const newChange = Math.round((item.change + delta) * 100) / 100;
          const newChangePercent = Math.round(((newChange / (newValue - newChange)) * 100) * 100) / 100;
          return {
            ...item,
            value: newValue,
            change: newChange,
            changePercent: newChangePercent,
          };
        })
      );
      setLastTick(Date.now());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-background/95 border-b border-border/60 text-xs py-1.5 px-3 flex items-center justify-between overflow-x-auto no-scrollbar gap-4 z-20 backdrop-blur-xs select-none">
      <div className="flex items-center gap-2 shrink-0 border-r border-border/60 pr-3">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-semibold tracking-wider text-[11px] text-foreground flex items-center gap-1">
          <Radio className="h-3 w-3 text-emerald-500" />
          NSE LIVE
        </span>
      </div>

      <div className="flex items-center gap-6 shrink-0 overflow-x-auto">
        {indices.map((idx) => {
          const isPositive = idx.change >= 0;
          return (
            <div key={idx.name} className="flex items-center gap-2 shrink-0">
              <span className="text-muted-foreground font-medium text-[11px]">{idx.name}</span>
              <span className="font-mono font-semibold text-foreground">
                {idx.value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span
                className={cn(
                  'flex items-center font-mono text-[11px] font-medium',
                  isPositive ? 'text-emerald-500' : 'text-rose-500'
                )}
              >
                {isPositive ? (
                  <TrendingUp className="h-3 w-3 mr-0.5 inline" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-0.5 inline" />
                )}
                {isPositive ? '+' : ''}
                {idx.change.toFixed(2)} ({isPositive ? '+' : ''}
                {idx.changePercent.toFixed(2)}%)
              </span>
            </div>
          );
        })}
      </div>

      <div className="hidden lg:flex items-center gap-2 shrink-0 text-[11px] text-muted-foreground pl-3 border-l border-border/60">
        <span>Session: <strong className="text-foreground">Regular Equity</strong></span>
        <span>•</span>
        <span>Market: <strong className="text-emerald-500">OPEN</strong></span>
      </div>
    </div>
  );
}
