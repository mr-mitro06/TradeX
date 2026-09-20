import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TradeX — Live Stock Trading & Demat Platform | NSE India",
  description:
    "TradeX is a Web3-inspired live equity trading platform for the Indian stock market (NSE). Execute real-time orders on NIFTY 50 blue-chips with instant margin settlement, Level 2 depth, candlestick charts, and professional trading analytics.",
  keywords: [
    "live trading",
    "stocks",
    "NIFTY 50",
    "real money trading",
    "demat",
    "NSE",
    "Indian stock market",
    "candlestick charts",
    "equity trading",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <TooltipProvider delay={0}>
            {children}
            <Toaster position="bottom-right" richColors closeButton />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
