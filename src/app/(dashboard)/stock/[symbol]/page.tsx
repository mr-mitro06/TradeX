import { NIFTY_50 } from '@/lib/data/nifty50';
import { StockDetailClient } from './stock-detail-client';

export function generateStaticParams() {
  return NIFTY_50.map((stock) => ({
    symbol: stock.symbol,
  }));
}

export default async function StockDetailPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;
  return <StockDetailClient symbol={symbol} />;
}
