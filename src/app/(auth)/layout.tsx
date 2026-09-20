import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login — TradeX",
  description: "Sign in to your TradeX paper trading account",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {children}
    </div>
  );
}
