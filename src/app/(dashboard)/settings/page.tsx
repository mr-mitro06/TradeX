'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Shield, Info, Palette, Building2, CheckCircle2, Lock, KeyRound, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Account & Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your trading preferences, Demat profile, and security credentials
        </p>
      </div>

      {/* Theme & Display */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Palette className="h-4 w-4 text-primary" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Color Theme</Label>
              <p className="text-xs text-muted-foreground">Select dark, light, or system sync</p>
            </div>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>

      {/* Demat & Trading Account */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Live Demat & Trading Account
            </span>
            <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 text-xs">
              KYC Active & Verified
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Unique Client Code (UCC)</p>
              <p className="text-xs text-muted-foreground font-mono">TX94821</p>
            </div>
            <Badge variant="outline" className="text-xs font-mono">NSE Equity / FO</Badge>
          </div>
          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Demat Beneficiary (BO ID)</p>
              <p className="text-xs text-muted-foreground font-mono">12081600 03948215 (CDSL)</p>
            </div>
            <span className="text-xs text-emerald-500 font-medium flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> CDSL Direct
            </span>
          </div>
          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Registered Email</p>
              <p className="text-xs text-muted-foreground font-mono">trader.pro@tradex.in</p>
            </div>
          </div>
          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Primary Bank Account</p>
              <p className="text-xs text-muted-foreground">HDFC Bank Ltd. (A/C: •••• 8821 • IFSC: HDFC0000060)</p>
            </div>
            <Badge variant="outline" className="text-xs text-emerald-500 border-emerald-500/30">
              Verified
            </Badge>
          </div>
          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Brokerage Plan</p>
              <p className="text-xs text-muted-foreground">TradeX Zero Delivery (₹0 Delivery, Flat ₹20 Intraday & F&O)</p>
            </div>
            <Badge variant="secondary" className="text-xs font-semibold">Active Plan</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Security & 2FA */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Lock className="h-4 w-4 text-primary" />
            Security & Authentication
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Two-Factor Authentication (TOTP)</p>
                <p className="text-xs text-muted-foreground">Authenticator app 6-digit TOTP required for live orders</p>
              </div>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-xs">
              Enabled
            </Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <KeyRound className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Trading PIN (TPIN)</p>
                <p className="text-xs text-muted-foreground">CDSL e-DIS authorization PIN for delivery sales</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="h-8 text-xs cursor-pointer">
              Manage TPIN
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Regulatory & Broker Information */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            TradeX Securities Regulatory Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <p className="text-muted-foreground leading-relaxed">
            TradeX Securities Limited is a registered Trading Member with the National Stock Exchange of India (NSE) and Depository Participant with Central Depository Services (India) Limited (CDSL).
          </p>
          <div className="p-3 bg-muted/40 rounded-lg font-mono space-y-1 text-muted-foreground">
            <div className="flex justify-between">
              <span>SEBI Registration No:</span>
              <span className="text-foreground font-semibold">INZ00029348</span>
            </div>
            <div className="flex justify-between">
              <span>NSE Member Code:</span>
              <span className="text-foreground font-semibold">90142</span>
            </div>
            <div className="flex justify-between">
              <span>CDSL DP ID:</span>
              <span className="text-foreground font-semibold">IN-DP-432-2026</span>
            </div>
            <div className="flex justify-between">
              <span>AMFI Registration (ARN):</span>
              <span className="text-foreground font-semibold">ARN-284910</span>
            </div>
          </div>
          <div className="flex justify-between text-muted-foreground pt-1">
            <span>TradeX Live Web Platform v1.0.0</span>
            <span>NSE Equity Live Engine</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
