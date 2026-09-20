'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useTradeXStore } from '@/lib/store';
import { formatCurrencyFull } from '@/lib/format';
import { cn } from '@/lib/utils';
import {
  Wallet,
  Plus,
  Minus,
  ArrowDownToLine,
  ArrowUpFromLine,
  Building2,
  CheckCircle2,
  QrCode,
  CreditCard,
  History,
  FileText,
  ShieldAlert,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const QUICK_AMOUNTS = [10000, 25000, 50000, 100000, 250000];

interface LedgerItem {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRADE' | 'CHARGES';
  title: string;
  mode: string;
  amount: number;
  date: string;
  status: 'SUCCESS' | 'PROCESSING';
}

const INITIAL_LEDGER: LedgerItem[] = [
  {
    id: 'TXN-902184',
    type: 'DEPOSIT',
    title: 'UPI Top-Up (Google Pay)',
    mode: 'UPI • ref/492817291',
    amount: 100000,
    date: 'Today, 09:32 AM',
    status: 'SUCCESS',
  },
  {
    id: 'TXN-883921',
    type: 'TRADE',
    title: 'Equity Buy: RELIANCE (CNC)',
    mode: 'NSE Exchange Execution',
    amount: -28420.50,
    date: 'Yesterday, 02:15 PM',
    status: 'SUCCESS',
  },
  {
    id: 'TXN-883922',
    type: 'CHARGES',
    title: 'STT, GST & NSE Txn Charges',
    mode: 'Contract Note #CN-883921',
    amount: -42.80,
    date: 'Yesterday, 02:15 PM',
    status: 'SUCCESS',
  },
  {
    id: 'TXN-794012',
    type: 'DEPOSIT',
    title: 'NetBanking Deposit (HDFC Bank)',
    mode: 'IMPS • ref/89201948',
    amount: 150000,
    date: '18 Sep 2026, 11:04 AM',
    status: 'SUCCESS',
  },
];

export default function FundsPage() {
  const { wallet, setWallet } = useTradeXStore();
  const [addAmount, setAddAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('trader@okaxis');
  const [addOpen, setAddOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [ledger, setLedger] = useState<LedgerItem[]>(INITIAL_LEDGER);

  if (!wallet) return null;

  const availableMargin = wallet.balance;
  const usedMargin = wallet.usedMargin || 0;
  const totalAccountValue = availableMargin + usedMargin + (wallet.investedAmount || 0);

  const handleAddFunds = () => {
    const amount = parseFloat(addAmount);
    if (!amount || amount < 100) {
      toast.error('Minimum deposit amount is ₹100');
      return;
    }

    const txnId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
    const updated = {
      ...wallet,
      balance: Math.round((wallet.balance + amount) * 100) / 100,
      totalDeposited: Math.round((wallet.totalDeposited + amount) * 100) / 100,
      totalPortfolioValue: Math.round((wallet.totalPortfolioValue + amount) * 100) / 100,
    };
    setWallet(updated);
    localStorage.setItem('tradex-wallet', JSON.stringify(updated));

    const newLedgerItem: LedgerItem = {
      id: txnId,
      type: 'DEPOSIT',
      title: paymentMethod === 'upi' ? `Instant UPI (${upiId})` : 'NetBanking (HDFC Bank)',
      mode: `${paymentMethod.toUpperCase()} • ref/${txnId}`,
      amount,
      date: 'Just now',
      status: 'SUCCESS',
    };
    setLedger([newLedgerItem, ...ledger]);

    toast.success(`Capital of ${formatCurrencyFull(amount)} credited instantly`, {
      description: `Ref ID: ${txnId} • Available for trading immediately`,
    });
    setAddAmount('');
    setAddOpen(false);
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (amount > availableMargin) {
      toast.error('Cannot withdraw more than available settled trading margin');
      return;
    }

    const txnId = `WD-${Math.floor(100000 + Math.random() * 900000)}`;
    const updated = {
      ...wallet,
      balance: Math.round((wallet.balance - amount) * 100) / 100,
      totalWithdrawn: Math.round((wallet.totalWithdrawn + amount) * 100) / 100,
      totalPortfolioValue: Math.round((wallet.totalPortfolioValue - amount) * 100) / 100,
    };
    setWallet(updated);
    localStorage.setItem('tradex-wallet', JSON.stringify(updated));

    const newLedgerItem: LedgerItem = {
      id: txnId,
      type: 'WITHDRAWAL',
      title: 'Payout to HDFC Bank (•••• 8821)',
      mode: 'IMPS Payout • Bank Settlement',
      amount: -amount,
      date: 'Just now',
      status: 'PROCESSING',
    };
    setLedger([newLedgerItem, ...ledger]);

    toast.success(`Withdrawal of ${formatCurrencyFull(amount)} initiated`, {
      description: 'Funds will be credited to your verified bank account via IMPS/NEFT',
    });
    setWithdrawAmount('');
    setWithdrawOpen(false);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Wallet className="h-6 w-6 text-primary" />
            Trading Funds & Margin
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            SEBI Regulated Trading & Demat Account Equity Management
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Deposit Capital Modal */}
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger
              className={cn(
                buttonVariants(),
                'bg-profit hover:bg-profit/90 text-white gap-2 font-semibold shadow-md cursor-pointer'
              )}
            >
              <Plus className="h-4 w-4" />
              Add Capital (Deposit)
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <ArrowDownLeft className="h-5 w-5 text-emerald-500" />
                  Deposit Trading Capital
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 pt-2">
                <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as 'upi' | 'netbanking')}>
                  <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="upi" className="gap-2">
                      <QrCode className="h-4 w-4" />
                      Instant UPI (Zero Fee)
                    </TabsTrigger>
                    <TabsTrigger value="netbanking" className="gap-2">
                      <Building2 className="h-4 w-4" />
                      NetBanking
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="upi" className="space-y-3 pt-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs">UPI ID / VPA</Label>
                      <Input
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="username@bank"
                        className="font-mono text-sm"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="netbanking" className="space-y-2 pt-2">
                    <div className="p-3 border border-border rounded-lg bg-muted/30 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Building2 className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-xs font-semibold">HDFC Bank Ltd. (Primary)</p>
                          <p className="text-[11px] text-muted-foreground font-mono">A/C: •••• •••• •••• 8821</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-emerald-500 border-emerald-500/30 text-[10px]">
                        Verified
                      </Badge>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="space-y-2">
                  <Label className="text-xs">Deposit Amount (₹)</Label>
                  <Input
                    type="number"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    placeholder="Enter amount (Min ₹100)"
                    className="tabular-nums font-mono text-lg font-semibold"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {QUICK_AMOUNTS.map((amt) => (
                    <Button
                      key={amt}
                      variant="outline"
                      size="sm"
                      onClick={() => setAddAmount(String(amt))}
                      className="text-xs font-mono"
                    >
                      {formatCurrencyFull(amt)}
                    </Button>
                  ))}
                </div>

                <Separator />

                <div className="p-2.5 rounded bg-muted/40 text-[11px] space-y-1 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Deposit Fee</span>
                    <span className="text-emerald-500 font-semibold">₹0.00 (Free)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Credit Speed</span>
                    <span className="text-foreground font-medium">Instant Real-time Margin</span>
                  </div>
                </div>

                <Button
                  onClick={handleAddFunds}
                  className="w-full bg-profit hover:bg-profit/90 text-white font-bold tracking-wide cursor-pointer h-10"
                >
                  Pay & Deposit {addAmount ? formatCurrencyFull(Number(addAmount)) : ''}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Withdraw Capital Modal */}
          <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
            <DialogTrigger
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'gap-2 font-semibold cursor-pointer'
              )}
            >
              <Minus className="h-4 w-4" />
              Withdraw Funds
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <ArrowUpRight className="h-5 w-5 text-amber-500" />
                  Withdraw Funds to Bank
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 pt-2">
                <div className="p-3 border border-border rounded-lg bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-1">Destination Bank Account</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">HDFC Bank Ltd.</p>
                      <p className="text-xs text-muted-foreground font-mono">A/C: •••• •••• •••• 8821 • IFSC: HDFC0000060</p>
                    </div>
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs px-1">
                  <span className="text-muted-foreground">Available Settled Cash:</span>
                  <span className="font-mono font-bold text-foreground">
                    {formatCurrencyFull(availableMargin)}
                  </span>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Withdrawal Amount (₹)</Label>
                  <Input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="tabular-nums font-mono text-lg font-semibold"
                    max={availableMargin}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs font-mono"
                    onClick={() => setWithdrawAmount(String(Math.floor(availableMargin * 0.5)))}
                  >
                    50% Balance
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs font-mono"
                    onClick={() => setWithdrawAmount(String(availableMargin))}
                  >
                    100% Full Balance
                  </Button>
                </div>

                <Separator />

                <div className="text-[11px] text-muted-foreground space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-500 font-medium">
                    <Clock className="h-3.5 w-3.5" />
                    Payout Cycle: Processed within 2-4 hours via IMPS
                  </div>
                  <p>Withdrawal requests placed before 8 PM are settled same day.</p>
                </div>

                <Button
                  onClick={handleWithdraw}
                  className="w-full font-bold tracking-wide cursor-pointer h-10"
                >
                  Confirm Payout to Bank
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Margin Overview Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card className="border-border/60 bg-card/60 backdrop-blur-xs border-primary/30 shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Available Margin (Cash)</span>
              <Wallet className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-bold font-mono tracking-tight text-foreground">
              {formatCurrencyFull(availableMargin)}
            </p>
            <p className="text-[11px] text-emerald-500 mt-1 font-medium flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Ready for order placement
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-xs shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Used Margin</span>
              <CreditCard className="h-4 w-4 text-amber-500" />
            </div>
            <p className="text-2xl font-bold font-mono tracking-tight text-foreground">
              {formatCurrencyFull(usedMargin)}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">Blocked in open positions & orders</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-xs shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Total Capital Equity</span>
              <Building2 className="h-4 w-4 text-cyan-400" />
            </div>
            <p className="text-2xl font-bold font-mono tracking-tight text-foreground">
              {formatCurrencyFull(totalAccountValue)}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">Net account equity value</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-xs shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Total Realized Deposits</span>
              <ArrowDownToLine className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold font-mono tracking-tight text-foreground">
              {formatCurrencyFull(wallet.totalDeposited)}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">Lifetime total capital deposited</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Verified Bank Account & Demat Profile */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                Linked Primary Bank Account
              </span>
              <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 text-[10px]">
                Penny Drop Verified
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground">Bank Name</span>
              <span className="font-semibold text-foreground">HDFC Bank Ltd.</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground">Account Number</span>
              <span className="font-mono font-semibold text-foreground">•••• •••• •••• 8821</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground">IFSC Code</span>
              <span className="font-mono text-foreground">HDFC0000060</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Account Type</span>
              <span className="text-foreground">Resident Individual Savings</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Demat & Trading Account Details
              </span>
              <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 text-[10px]">
                KYC Active
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground">Beneficiary Owner (BO ID)</span>
              <span className="font-mono font-semibold text-foreground">12081600 03948215 (CDSL)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground">Unique Client Code (UCC)</span>
              <span className="font-mono font-semibold text-foreground">TX94821</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground">Exchange Segment</span>
              <span className="text-foreground font-medium">NSE Cash (Equity) & Derivatives</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">SEBI Registration</span>
              <span className="font-mono text-foreground">INZ00029348</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History & Fund Ledger */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <History className="h-4 w-4 text-primary" />
              Funds & Transaction Ledger
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live record of all deposits, payouts, and exchange transaction settlements
            </p>
          </div>
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 cursor-pointer">
            <FileText className="h-3.5 w-3.5" />
            Download P&L Statement
          </Button>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border/40">
            {ledger.map((item) => {
              const isPositive = item.amount > 0;
              return (
                <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'h-8 w-8 rounded-full flex items-center justify-center shrink-0',
                        isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                      )}
                    >
                      {isPositive ? (
                        <ArrowDownLeft className="h-4 w-4" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{item.title}</p>
                      <p className="text-[11px] text-muted-foreground">{item.mode} • {item.date}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className={cn(
                        'font-mono font-bold text-sm tabular-nums',
                        isPositive ? 'text-emerald-500' : 'text-foreground'
                      )}
                    >
                      {isPositive ? '+' : ''}
                      {formatCurrencyFull(item.amount)}
                    </p>
                    <Badge variant="outline" className="text-[10px] py-0 px-1 border-border/60 font-mono">
                      {item.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* SEBI Compliance Notice */}
      <Card className="border-border/40 bg-muted/20">
        <CardContent className="p-4 flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">SEBI Investor Safety & Fund Protection:</strong> Client funds are strictly held in SEBI-designated separate client bank accounts with Scheduled Commercial Banks. Securities purchased are held directly in your beneficiary owner Demat account with CDSL.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
