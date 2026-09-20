'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useTradeXStore } from '@/lib/store';
import { formatCurrencyFull } from '@/lib/format';
import { calculateCharges } from '@/lib/trading/charges';
import type { OrderSide, OrderType, ProductType, StockQuote, Order } from '@/lib/market-data/types';
import { toast } from 'sonner';
import { ShieldCheck, Target, Loader2, Info, ChevronDown, ChevronUp, Zap } from 'lucide-react';

interface OrderPanelProps {
  quote: StockQuote | null;
}

export function OrderPanel({ quote }: OrderPanelProps) {
  const { wallet, setWallet, orders, setOrders, positions, setPositions, userId } = useTradeXStore();
  const [side, setSide] = useState<OrderSide>('BUY');
  const [orderType, setOrderType] = useState<OrderType>('MARKET');
  const [productType, setProductType] = useState<ProductType>('DELIVERY');
  const [quantity, setQuantity] = useState('10');
  const [limitPrice, setLimitPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [showCharges, setShowCharges] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!quote) return null;

  const currentUserId = userId || 'user-tx-94821';
  const qty = parseInt(quantity) || 0;
  const price = orderType === 'MARKET' ? quote.price : (parseFloat(limitPrice) || quote.price);
  const turnover = qty * price;

  // Margin calculation: 100% for CNC (Delivery), 20% for MIS (Intraday with 5x leverage)
  const marginMultiplier = productType === 'INTRADAY' ? 0.2 : 1.0;
  const marginRequired = qty > 0 ? Math.round(turnover * marginMultiplier * 100) / 100 : 0;
  
  // Real Indian Brokerage & Statutory Taxes
  const charges = calculateCharges(side, productType, qty, price);
  const totalPayable = Math.round((marginRequired + (side === 'BUY' ? charges.totalCharges : 0)) * 100) / 100;
  const canAfford = wallet && totalPayable <= wallet.balance;

  const handlePlaceOrder = async () => {
    if (!wallet || !quote) return;
    if (qty <= 0) {
      toast.error('Please enter a valid quantity of shares');
      return;
    }
    if (side === 'BUY' && !canAfford) {
      toast.error('Insufficient available margin in trading account');
      return;
    }

    setLoading(true);

    try {
      // Simulate ultra-fast live exchange gateway latency (250ms)
      await new Promise(resolve => setTimeout(resolve, 300));

      const orderId = `NSE-${Date.now()}`;
      const now = new Date().toISOString();

      const newOrder: Order = {
        id: orderId,
        userId: currentUserId,
        stockSymbol: quote.symbol,
        companyName: quote.companyName,
        side,
        orderType,
        productType,
        quantity: qty,
        price,
        stopLoss: stopLoss ? parseFloat(stopLoss) : undefined,
        target: targetPrice ? parseFloat(targetPrice) : undefined,
        status: orderType === 'MARKET' ? 'FILLED' : 'PENDING',
        filledQuantity: orderType === 'MARKET' ? qty : 0,
        averagePrice: orderType === 'MARKET' ? quote.price : 0,
        createdAt: now,
        executedAt: orderType === 'MARKET' ? now : undefined,
      };

      // Execute order & update live trading wallet & portfolio
      if (orderType === 'MARKET') {
        if (side === 'BUY') {
          const updatedWallet = {
            ...wallet,
            balance: Math.round((wallet.balance - totalPayable) * 100) / 100,
            usedMargin: Math.round(((wallet.usedMargin || 0) + marginRequired) * 100) / 100,
            investedAmount: Math.round((wallet.investedAmount + turnover) * 100) / 100,
            totalPortfolioValue: Math.round((wallet.totalPortfolioValue - charges.totalCharges) * 100) / 100,
          };
          setWallet(updatedWallet);
          localStorage.setItem('tradex-wallet', JSON.stringify(updatedWallet));

          // Update portfolio positions
          const existingPosition = positions.find(
            p => p.stockSymbol === quote.symbol && p.productType === productType
          );

          if (existingPosition) {
            const newQty = existingPosition.quantity + qty;
            const newAvgPrice =
              (existingPosition.averagePrice * existingPosition.quantity + quote.price * qty) / newQty;
            const updatedPositions = positions.map(p =>
              p.stockSymbol === quote.symbol && p.productType === productType
                ? {
                    ...p,
                    quantity: newQty,
                    averagePrice: Math.round(newAvgPrice * 100) / 100,
                    investedValue: Math.round(newQty * newAvgPrice * 100) / 100,
                    currentValue: Math.round(newQty * quote.price * 100) / 100,
                    currentPrice: quote.price,
                    pnl: Math.round((quote.price - newAvgPrice) * newQty * 100) / 100,
                    pnlPercent: Math.round(((quote.price - newAvgPrice) / newAvgPrice) * 10000) / 100,
                  }
                : p
            );
            setPositions(updatedPositions);
            localStorage.setItem('tradex-positions', JSON.stringify(updatedPositions));
          } else {
            const newPosition = {
              id: `POS-${Date.now()}`,
              userId: currentUserId,
              stockSymbol: quote.symbol,
              companyName: quote.companyName,
              productType,
              quantity: qty,
              averagePrice: quote.price,
              currentPrice: quote.price,
              investedValue: Math.round(qty * quote.price * 100) / 100,
              currentValue: Math.round(qty * quote.price * 100) / 100,
              pnl: 0,
              pnlPercent: 0,
              stopLoss: stopLoss ? parseFloat(stopLoss) : undefined,
              target: targetPrice ? parseFloat(targetPrice) : undefined,
            };
            const updatedPositions = [...positions, newPosition];
            setPositions(updatedPositions);
            localStorage.setItem('tradex-positions', JSON.stringify(updatedPositions));
          }
        } else {
          // SELL
          const existingPosition = positions.find(
            p => p.stockSymbol === quote.symbol && p.productType === productType
          );
          if (!existingPosition || existingPosition.quantity < qty) {
            toast.error(`Insufficient ${productType} shares in Demat/Holdings to sell`);
            setLoading(false);
            return;
          }

          const saleProceeds = Math.round((turnover - charges.totalCharges) * 100) / 100;
          const costBasis = Math.round(qty * existingPosition.averagePrice * 100) / 100;
          const realizedPnl = Math.round((saleProceeds - costBasis) * 100) / 100;

          const updatedWallet = {
            ...wallet,
            balance: Math.round((wallet.balance + saleProceeds) * 100) / 100,
            usedMargin: Math.max(0, Math.round(((wallet.usedMargin || 0) - (costBasis * marginMultiplier)) * 100) / 100),
            investedAmount: Math.max(0, Math.round((wallet.investedAmount - costBasis) * 100) / 100),
            totalPortfolioValue: Math.round((wallet.totalPortfolioValue + realizedPnl) * 100) / 100,
          };
          setWallet(updatedWallet);
          localStorage.setItem('tradex-wallet', JSON.stringify(updatedWallet));

          if (existingPosition.quantity === qty) {
            const updatedPositions = positions.filter(
              p => !(p.stockSymbol === quote.symbol && p.productType === productType)
            );
            setPositions(updatedPositions);
            localStorage.setItem('tradex-positions', JSON.stringify(updatedPositions));
          } else {
            const newQty = existingPosition.quantity - qty;
            const updatedPositions = positions.map(p =>
              p.stockSymbol === quote.symbol && p.productType === productType
                ? {
                    ...p,
                    quantity: newQty,
                    investedValue: Math.round(newQty * p.averagePrice * 100) / 100,
                    currentValue: Math.round(newQty * quote.price * 100) / 100,
                    currentPrice: quote.price,
                    pnl: Math.round((quote.price - p.averagePrice) * newQty * 100) / 100,
                    pnlPercent: Math.round(((quote.price - p.averagePrice) / p.averagePrice) * 10000) / 100,
                  }
                : p
            );
            setPositions(updatedPositions);
            localStorage.setItem('tradex-positions', JSON.stringify(updatedPositions));
          }
        }
      }

      // Add to orders
      const updatedOrders = [newOrder, ...orders];
      setOrders(updatedOrders);
      localStorage.setItem('tradex-orders', JSON.stringify(updatedOrders));

      toast.success(
        `${side === 'BUY' ? 'Bought' : 'Sold'} ${qty} ${quote.symbol} @ ${formatCurrencyFull(price)}`,
        {
          description:
            orderType === 'MARKET'
              ? `Executed on NSE • Ref: ${orderId}`
              : `Order placed on NSE • Limit @ ${formatCurrencyFull(price)}`,
        }
      );

      // Reset form
      setQuantity('10');
      setLimitPrice('');
      setStopLoss('');
      setTargetPrice('');
    } catch {
      toast.error('Exchange communication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-border/60 shadow-lg bg-card/60 backdrop-blur-xs">
      <Tabs value={side} onValueChange={(v) => setSide(v as OrderSide)}>
        <TabsList className="w-full grid grid-cols-2 rounded-none border-b border-border/80 h-11 p-0 bg-muted/40">
          <TabsTrigger
            value="BUY"
            className="rounded-none data-[state=active]:bg-profit/15 data-[state=active]:text-profit data-[state=active]:border-b-2 data-[state=active]:border-profit font-bold tracking-wide"
          >
            BUY (LONG)
          </TabsTrigger>
          <TabsTrigger
            value="SELL"
            className="rounded-none data-[state=active]:bg-loss/15 data-[state=active]:text-loss data-[state=active]:border-b-2 data-[state=active]:border-loss font-bold tracking-wide"
          >
            SELL (SHORT)
          </TabsTrigger>
        </TabsList>

        <CardContent className="p-4 space-y-4">
          {/* Product Type (Delivery vs Intraday MIS) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground font-medium">Product</Label>
              <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-mono text-cyan-400 border-cyan-500/30">
                {productType === 'INTRADAY' ? 'MIS • 5x Leverage' : 'CNC • 100% Demat'}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={productType === 'DELIVERY' ? 'default' : 'outline'}
                size="sm"
                className={`h-8 text-xs justify-center cursor-pointer ${
                  productType === 'DELIVERY' ? 'bg-primary text-primary-foreground font-semibold' : ''
                }`}
                onClick={() => setProductType('DELIVERY')}
              >
                Delivery (CNC)
              </Button>
              <Button
                type="button"
                variant={productType === 'INTRADAY' ? 'default' : 'outline'}
                size="sm"
                className={`h-8 text-xs justify-center cursor-pointer ${
                  productType === 'INTRADAY' ? 'bg-primary text-primary-foreground font-semibold' : ''
                }`}
                onClick={() => setProductType('INTRADAY')}
              >
                <Zap className="h-3 w-3 mr-1 text-amber-400" />
                Intraday (MIS)
              </Button>
            </div>
          </div>

          {/* Order Type */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground font-medium">Order Type</Label>
            <Select value={orderType} onValueChange={(v) => v && setOrderType(v as OrderType)}>
              <SelectTrigger className="h-8 text-xs cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MARKET">Market (Instant Fill)</SelectItem>
                <SelectItem value="LIMIT">Limit (Set Price)</SelectItem>
                <SelectItem value="STOP">SL-Limit (Stop Loss)</SelectItem>
                <SelectItem value="STOP_LIMIT">SL-Market (SL-M)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quantity */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <Label className="text-xs text-muted-foreground font-medium">Quantity</Label>
              <span className="text-[10px] text-muted-foreground font-mono">Lot Size: 1</span>
            </div>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Qty (e.g. 10)"
              className="h-9 tabular-nums font-mono text-sm"
              min="1"
            />
          </div>

          {/* Limit Price (for non-market orders) */}
          {orderType !== 'MARKET' && (
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground font-medium">Trigger / Limit Price (₹)</Label>
              <Input
                type="number"
                value={limitPrice}
                onChange={(e) => setLimitPrice(e.target.value)}
                placeholder={formatCurrencyFull(quote.price)}
                className="h-9 tabular-nums font-mono text-sm"
                step="0.05"
              />
            </div>
          )}

          {/* Advanced Target & SL Controls */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="space-y-1.5">
              <Label className="text-[11px] text-muted-foreground flex items-center gap-1 font-medium">
                <ShieldCheck className="h-3 w-3 text-rose-400" />
                Stop Loss (₹)
              </Label>
              <Input
                type="number"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                placeholder="Optional"
                className="h-8 tabular-nums font-mono text-xs"
                step="0.05"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] text-muted-foreground flex items-center gap-1 font-medium">
                <Target className="h-3 w-3 text-emerald-400" />
                Target Price (₹)
              </Label>
              <Input
                type="number"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder="Optional"
                className="h-8 tabular-nums font-mono text-xs"
                step="0.05"
              />
            </div>
          </div>

          <Separator />

          {/* Real Live Margin & Charges Summary */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Order Value (Turnover)</span>
              <span className="tabular-nums font-mono font-medium text-foreground">
                {qty > 0 ? formatCurrencyFull(turnover) : '₹0.00'}
              </span>
            </div>

            <div className="flex justify-between text-muted-foreground">
              <span>Margin Required ({productType === 'INTRADAY' ? '20% - 5x' : '100%'})</span>
              <span className="tabular-nums font-mono font-medium text-foreground">
                {qty > 0 ? formatCurrencyFull(marginRequired) : '₹0.00'}
              </span>
            </div>

            {/* Statutory Charges Dropdown */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowCharges(!showCharges)}
                className="w-full flex items-center justify-between text-[11px] text-muted-foreground hover:text-foreground py-1 border-y border-border/40 cursor-pointer"
              >
                <span className="flex items-center gap-1">
                  <Info className="h-3 w-3 text-primary" />
                  Brokerage & Statutory Charges
                </span>
                <span className="flex items-center gap-1 font-mono font-medium text-foreground">
                  ₹{charges.totalCharges.toFixed(2)}
                  {showCharges ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </span>
              </button>

              {showCharges && (
                <div className="p-2.5 mt-1 rounded bg-muted/40 text-[11px] space-y-1 font-mono text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Brokerage ({productType === 'DELIVERY' ? 'Zero Delivery' : 'Flat ₹20/0.03%'})</span>
                    <span className="text-foreground">₹{charges.brokerage.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>STT / CTT ({productType === 'DELIVERY' ? '0.1%' : '0.025% on Sell'})</span>
                    <span className="text-foreground">₹{charges.stt.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Exchange Txn Charges (NSE)</span>
                    <span className="text-foreground">₹{charges.exchangeTxnFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18% on fees)</span>
                    <span className="text-foreground">₹{charges.gst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stamp Duty (Govt of India)</span>
                    <span className="text-foreground">₹{charges.stampDuty.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between font-semibold text-sm pt-1">
              <span>{side === 'BUY' ? 'Total Payable' : 'Net Receivable'}</span>
              <span className="tabular-nums font-mono text-primary">
                {qty > 0 ? formatCurrencyFull(totalPayable) : '₹0.00'}
              </span>
            </div>

            {wallet && (
              <div className="flex justify-between text-[11px] text-muted-foreground pt-0.5">
                <span>Available Margin</span>
                <span className="tabular-nums font-mono font-semibold text-foreground">
                  {formatCurrencyFull(wallet.balance)}
                </span>
              </div>
            )}
          </div>

          {/* Place Order Button */}
          <Button
            onClick={handlePlaceOrder}
            disabled={loading || qty <= 0 || (side === 'BUY' && !canAfford)}
            className={`w-full h-11 font-bold tracking-wider text-sm cursor-pointer shadow-md ${
              side === 'BUY'
                ? 'bg-profit hover:bg-profit/90 text-white'
                : 'bg-loss hover:bg-loss/90 text-white'
            }`}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              `EXECUTE ${side} ORDER (${productType})`
            )}
          </Button>

          {side === 'BUY' && qty > 0 && !canAfford && (
            <p className="text-xs text-rose-500 font-medium text-center">
              Insufficient trading margin in account. Please add funds.
            </p>
          )}
        </CardContent>
      </Tabs>
    </Card>
  );
}
