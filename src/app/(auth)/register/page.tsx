'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, TrendingUp, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pan, setPan] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const newUcc = `TX${Math.floor(10000 + Math.random() * 90000)}`;
      localStorage.setItem(
        'tradex-user',
        JSON.stringify({
          id: `user-${newUcc.toLowerCase()}`,
          email: email || 'trader@tradex.in',
          name: name || 'Indian Equity Trader',
          ucc: newUcc,
          dematId: `12081600 ${Math.floor(10000000 + Math.random() * 90000000)}`,
        })
      );

      router.push('/');
      router.refresh();
    } catch {
      setError('Demat onboarding failed. Please check PAN and details.');
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
        <CardHeader className="text-center space-y-3 pb-3">
          <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center justify-center gap-2">
              <CardTitle className="text-2xl font-bold tracking-tight">Open Demat Account</CardTitle>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                Free ₹0 Brokerage
              </Badge>
            </div>
            <CardDescription className="mt-1 text-xs">
              Paperless 100% digital KYC with CDSL Demat Integration
            </CardDescription>
          </div>
        </CardHeader>

        <form onSubmit={handleRegister}>
          <CardContent className="space-y-3">
            {error && (
              <div className="p-3 text-xs text-destructive bg-destructive/10 rounded-lg">
                {error}
              </div>
            )}
            <div className="space-y-1">
              <Label htmlFor="name" className="text-xs">Full Name (as per PAN Card)</Label>
              <Input
                id="name"
                type="text"
                placeholder="Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-9 text-sm"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="mobile" className="text-xs">Mobile (Aadhaar linked)</Label>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="98765 43210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="h-9 text-sm font-mono"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="pan" className="text-xs">PAN Card Number</Label>
                <Input
                  id="pan"
                  type="text"
                  placeholder="ABCDE1234F"
                  value={pan}
                  onChange={(e) => setPan(e.target.value.toUpperCase())}
                  className="h-9 text-sm font-mono uppercase"
                  maxLength={10}
                  required
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="email" className="text-xs">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-9 text-sm"
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password" className="text-xs">Trading Account Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-9 text-sm"
                required
              />
            </div>

            <div className="p-2.5 rounded bg-muted/40 text-[11px] text-muted-foreground space-y-1">
              <div className="flex items-center gap-1.5 text-foreground font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                Zero AMC for 1st Year • Zero Brokerage on Equity Delivery
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-2">
            <Button
              type="submit"
              className="w-full h-11 font-bold tracking-wide cursor-pointer bg-profit hover:bg-profit/90 text-white shadow-md"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying KRA & Generating Demat...
                </>
              ) : (
                'Verify & Open Demat Account'
              )}
            </Button>

            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Direct CDSL Depository Participant & Member NSE</span>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-1">
              Already have an account?{' '}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}
