'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useTradeXStore } from '@/lib/store';
import { formatCurrencyFull, formatPercent, getPnLColor } from '@/lib/format';
import type { Order, OrderStatus } from '@/lib/market-data/types';
import { ClipboardList, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Link from 'next/link';

const statusColors: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  OPEN: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  PARTIALLY_FILLED: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  FILLED: 'bg-profit/10 text-profit border-profit/20',
  CLOSED: 'bg-muted text-muted-foreground border-border',
  CANCELLED: 'bg-muted text-muted-foreground border-border',
  REJECTED: 'bg-loss/10 text-loss border-loss/20',
  SL_HIT: 'bg-loss/10 text-loss border-loss/20',
  TARGET_HIT: 'bg-profit/10 text-profit border-profit/20',
};

export default function OrdersPage() {
  const { orders, setOrders } = useTradeXStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('tradex-orders');
    if (saved) {
      setOrders(JSON.parse(saved));
    }
    setLoading(false);
  }, [setOrders]);

  const openOrders = orders.filter((o) => ['OPEN', 'PARTIALLY_FILLED'].includes(o.status));
  const pendingOrders = orders.filter((o) => o.status === 'PENDING');
  const closedOrders = orders.filter((o) => ['FILLED', 'CLOSED', 'CANCELLED', 'REJECTED', 'SL_HIT', 'TARGET_HIT'].includes(o.status));

  const cancelOrder = (orderId: string) => {
    const updated = orders.map((o) =>
      o.id === orderId ? { ...o, status: 'CANCELLED' as const } : o
    );
    setOrders(updated);
    localStorage.setItem('tradex-orders', JSON.stringify(updated));
    toast.success('Order cancelled');
  };

  const OrderCard = ({ order }: { order: Order }) => (
    <Link href={`/stock/${order.stockSymbol}`}>
      <Card className="border-border/60 bg-card/60 backdrop-blur-xs hover:border-primary/40 transition-all cursor-pointer shadow-xs">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base">{order.stockSymbol}</span>
                <Badge
                  variant="outline"
                  className={order.side === 'BUY' ? 'text-profit border-profit/30 font-bold' : 'text-loss border-loss/30 font-bold'}
                >
                  {order.side}
                </Badge>
                <Badge variant="outline" className={`text-[10px] font-mono ${order.productType === 'INTRADAY' ? 'text-amber-500 border-amber-500/30' : 'text-primary border-primary/30'}`}>
                  {order.productType || 'DELIVERY'}
                </Badge>
                <Badge variant="outline" className={statusColors[order.status]}>
                  {order.status.replace('_', ' ')}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{order.companyName}</p>
              <div className="flex flex-wrap gap-4 text-xs font-mono text-muted-foreground mt-1">
                <span>Qty: <strong className="text-foreground">{order.quantity}</strong></span>
                <span>Type: <strong className="text-foreground">{order.orderType}</strong></span>
                <span>Order Price: <strong className="text-foreground">{formatCurrencyFull(order.price)}</strong></span>
                {order.averagePrice > 0 && (
                  <span>Exec Avg: <strong className="text-emerald-500">{formatCurrencyFull(order.averagePrice)}</strong></span>
                )}
              </div>
              {(order.stopLoss || order.target) && (
                <div className="flex gap-4 text-xs font-mono text-muted-foreground">
                  {order.stopLoss && <span>SL: {formatCurrencyFull(order.stopLoss)}</span>}
                  {order.target && <span>Target: {formatCurrencyFull(order.target)}</span>}
                </div>
              )}
              <p className="text-[11px] font-mono text-muted-foreground">
                Ref: {order.id} • {new Date(order.createdAt).toLocaleString('en-IN')}
              </p>
            </div>
            {(order.status === 'PENDING' || order.status === 'OPEN') && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  cancelOrder(order.id);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  const EmptyState = ({ message }: { message: string }) => (
    <div className="py-12 text-center text-muted-foreground">
      <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-30" />
      <p>{message}</p>
      <Link href="/nifty50">
        <Button variant="outline" className="mt-4">Explore Markets</Button>
      </Link>
    </div>
  );

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-primary" />
          Orders
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Track all your orders</p>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All ({orders.length})</TabsTrigger>
          <TabsTrigger value="open">Open ({openOrders.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingOrders.length})</TabsTrigger>
          <TabsTrigger value="closed">Closed ({closedOrders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-2 mt-4">
          {loading ? (
            [...Array(3)].map((_, i) => <Skeleton key={i} className="h-24" />)
          ) : orders.length === 0 ? (
            <EmptyState message="You don't have any orders yet." />
          ) : (
            orders.map((order, i) => (
              <motion.div key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                <OrderCard order={order} />
              </motion.div>
            ))
          )}
        </TabsContent>

        <TabsContent value="open" className="space-y-2 mt-4">
          {openOrders.length === 0 ? <EmptyState message="No open orders." /> :
            openOrders.map((o) => <OrderCard key={o.id} order={o} />)}
        </TabsContent>

        <TabsContent value="pending" className="space-y-2 mt-4">
          {pendingOrders.length === 0 ? <EmptyState message="No pending orders." /> :
            pendingOrders.map((o) => <OrderCard key={o.id} order={o} />)}
        </TabsContent>

        <TabsContent value="closed" className="space-y-2 mt-4">
          {closedOrders.length === 0 ? <EmptyState message="No closed orders." /> :
            closedOrders.map((o) => <OrderCard key={o.id} order={o} />)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
