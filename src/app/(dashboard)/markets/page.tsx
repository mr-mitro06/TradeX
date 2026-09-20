'use client';

// Markets page - redirects to NIFTY 50 as the main market view
import { redirect } from 'next/navigation';

export default function MarketsPage() {
  redirect('/nifty50');
}
