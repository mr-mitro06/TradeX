'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTradeXStore } from '@/lib/store';
import {
  LayoutDashboard,
  TrendingUp,
  BarChart3,
  ArrowUpRight,
  Zap,
  Star,
  Briefcase,
  ClipboardList,
  Wallet,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/markets', label: 'Markets', icon: TrendingUp },
  { href: '/nifty50', label: 'NIFTY 50', icon: BarChart3 },
  { href: '/52w-high', label: '52W High', icon: ArrowUpRight },
  { href: '/high-performance', label: 'High Performance', icon: Zap },
  { href: '/watchlist', label: 'Watchlist', icon: Star },
  { type: 'separator' as const },
  { href: '/portfolio', label: 'Portfolio', icon: Briefcase },
  { href: '/orders', label: 'Orders', icon: ClipboardList },
  { href: '/funds', label: 'Funds', icon: Wallet },
  { type: 'separator' as const },
  { href: '/settings', label: 'Settings', icon: Settings },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useTradeXStore();

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 240 : 68 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="hidden md:flex flex-col h-full border-r border-border bg-sidebar relative z-30"
    >
      {/* Logo */}
      <div className="flex items-center h-14 px-4 border-b border-border">
        <Link href="/" className="flex items-center gap-2 overflow-hidden">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground font-bold text-sm shrink-0">
            TX
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="font-semibold text-base whitespace-nowrap overflow-hidden"
              >
                TradeX
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {navItems.map((item, index) => {
          if ('type' in item && item.type === 'separator') {
            return <div key={`sep-${index}`} className="my-2 h-px bg-border" />;
          }

          if (!('href' in item)) return null;
          const Icon = item.icon;
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href));

          const linkContent = (
            <Link
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-150',
                'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-primary font-medium'
                  : 'text-sidebar-foreground/70'
              )}
            >
              <Icon className={cn('h-4 w-4 shrink-0', isActive && 'text-sidebar-primary')} />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );

          if (!sidebarOpen) {
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger className="w-full">{linkContent}</TooltipTrigger>
                <TooltipContent side="right" className="font-medium">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          }

          return <div key={item.href}>{linkContent}</div>;
        })}
      </nav>

      {/* Collapse Button */}
      <div className="p-2 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-full justify-center"
        >
          {sidebarOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Disclaimer */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-3 pb-3 overflow-hidden"
          >
            <p className="text-[10px] text-muted-foreground/60 leading-tight">
              TradeX Securities Ltd. • SEBI Regn: INZ00029348 • Member NSE (90142) • CDSL: IN-DP-432-2026. Real-time Indian equity trading.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}
