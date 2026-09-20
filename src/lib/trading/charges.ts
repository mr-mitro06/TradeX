// Indian Equity Trading Charges & Taxes Calculator
// Complies with NSE & SEBI fee structure

export interface TradingCharges {
  turnover: number;
  brokerage: number;
  stt: number; // Securities Transaction Tax
  exchangeTxnFee: number; // NSE transaction charges
  sebiTurnoverFee: number; // SEBI regulatory fee
  gst: number; // 18% on (brokerage + exchange txn fee + SEBI fee)
  stampDuty: number; // Stamp duty on buy
  totalCharges: number;
  netPayableOrReceivable: number;
}

export function calculateCharges(
  side: 'BUY' | 'SELL',
  productType: 'DELIVERY' | 'INTRADAY',
  quantity: number,
  price: number
): TradingCharges {
  const turnover = Math.round(quantity * price * 100) / 100;

  // Brokerage:
  // Delivery (CNC): ₹0
  // Intraday (MIS): Flat ₹20 or 0.03% of turnover, whichever is lower
  let brokerage = 0;
  if (productType === 'INTRADAY') {
    brokerage = Math.min(20, Math.round(turnover * 0.0003 * 100) / 100);
  }

  // STT / CTT:
  // Delivery: 0.1% on Buy and Sell
  // Intraday: 0.025% on Sell only, 0 on Buy
  let stt = 0;
  if (productType === 'DELIVERY') {
    stt = Math.round(turnover * 0.001); // Rounded to nearest rupee
  } else if (productType === 'INTRADAY' && side === 'SELL') {
    stt = Math.round(turnover * 0.00025);
  }

  // Exchange Transaction Fee:
  // NSE Equity: 0.00345% of turnover
  const exchangeTxnFee = Math.round(turnover * 0.0000345 * 100) / 100;

  // SEBI Turnover Fee:
  // ₹10 per crore = 0.0001% of turnover
  const sebiTurnoverFee = Math.max(0.01, Math.round(turnover * 0.000001 * 100) / 100);

  // GST:
  // 18% on (Brokerage + Exchange Txn Fee + SEBI Fee)
  const gst = Math.round((brokerage + exchangeTxnFee + sebiTurnoverFee) * 0.18 * 100) / 100;

  // Stamp Duty (Govt of India):
  // Buy only: Delivery: 0.015%, Intraday: 0.003%
  let stampDuty = 0;
  if (side === 'BUY') {
    if (productType === 'DELIVERY') {
      stampDuty = Math.round(turnover * 0.00015 * 100) / 100;
    } else {
      stampDuty = Math.round(turnover * 0.00003 * 100) / 100;
    }
  }

  const totalCharges =
    Math.round((brokerage + stt + exchangeTxnFee + sebiTurnoverFee + gst + stampDuty) * 100) / 100;

  // Net payable on BUY = turnover + totalCharges
  // Net receivable on SELL = turnover - totalCharges
  const netPayableOrReceivable =
    side === 'BUY'
      ? Math.round((turnover + totalCharges) * 100) / 100
      : Math.round((turnover - totalCharges) * 100) / 100;

  return {
    turnover,
    brokerage,
    stt,
    exchangeTxnFee,
    sebiTurnoverFee,
    gst,
    stampDuty,
    totalCharges,
    netPayableOrReceivable,
  };
}
