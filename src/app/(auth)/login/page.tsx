'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, TrendingUp, ShieldCheck, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('trader.pro@tradex.in');
  const [password, setPassword] = useState('••••••••');
  const [totp, setTotp] = useState('849201');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 600));

      localStorage.setItem(
        'tradex-user',
        JSON.stringify({
          id: 'user-tx-94821',
          email: email || 'trader.pro@tradex.in',
          name: 'Pro Trader',
          ucc: 'TX94821',
          dematId: '12081600 03948215',
        })
      );

      router.push('/');
      router.refresh();
    } catch {
      setError('Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md"
    >
      <Card className="border-border/60 shadow-2xl bg-card/80 backdrop-blur-md">
        <CardHeader className="text-center space-y-3 pb-4">
          <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center justify-center gap-2">
              <CardTitle className="text-2xl font-bold tracking-tight">TradeX Pro</CardTitle>
              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-[10px] font-mono">
                NSE LIVE
              </Badge>
            </div>
            <CardDescription className="mt-1 text-xs">
              Sign in to your Live Trading & Demat Account
            </CardDescription>
          </div>
        </CardHeader>

        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-xs text-destructive bg-destructive/10 rounded-lg">
                {error}
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs">Client ID / Registered Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="TX94821 or trader@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 text-sm font-mono"
                required
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-xs">Password</Label>
                <Link href="#" className="text-[11px] text-primary hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 text-sm"
                required
              />
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between items-center">
                <Label htmlFor="totp" className="text-xs flex items-center gap-1">
                  <Lock className="h-3 w-3 text-primary" />
                  App 2FA / TOTP Authenticator Code
                </Label>
                <span className="text-[10px] text-muted-foreground font-mono">6 Digits</span>
              </div>
              <Input
                id="totp"
                type="text"
                placeholder="Enter 6-digit TOTP"
                value={totp}
                onChange={(e) => setTotp(e.target.value)}
                className="h-10 text-sm font-mono tracking-widest text-center"
                maxLength={6}
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-2">
            <Button
              type="submit"
              className="w-full h-11 font-bold tracking-wide cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying Credentials & 2FA...
                </>
              ) : (
                'Secure Login to TradeX Live'
              )}
            </Button>

            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground pt-1">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>256-bit SSL Encrypted • SEBI & NSE Regulated Broker</span>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-2">
              New to TradeX?{' '}
              <Link href="/register" className="text-primary font-semibold hover:underline">
                Open Free Demat Account
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>

      <p className="text-[11px] text-muted-foreground/60 text-center mt-4 px-4 leading-relaxed">
        TradeX Securities Ltd. • Member NSE (Member Code: 90142) • SEBI Regn: INZ00029348.
        Investments in securities market are subject to market risks. Read all scheme related documents carefully.
      </p>
    </motion.div>
  );
}
