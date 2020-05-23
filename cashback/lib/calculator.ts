import { findById } from '../lib/invoice';
import { getDollarPrice, convert } from './price';
import { BigNumber } from 'bignumber.js';

export async function defaultAmount(invoice, merchant): Promise<number> {

  let rate = new BigNumber(0.01) // 1% back

  var amount = new BigNumber(invoice.amount).times(rate);

  var maxAmount = await convert({

    currency: 'USD',

    amount: 5

  }, invoice.currency);

  if (amount < maxAmount) {

    return amount.toNumber();

  } else {

    return maxAmount;

  }

}

async function computeCustomerCashBackAmountForInvoice(invoice: any, merchant?: any): Promise<number> {

  /* 
    
    1) first check invoice for cashback_amount field, use that

      or

    2) check cashback_merchant for cashback amount, use that

      or

    3) use default value (10% up to $5)

  */

  if (invoice.cashback_amount >= 0) {
    
    return parseFloat(invoice.cashback_amount.toFixed(5));

  }

  console.log('compute default amount',invoice);

  let amount = await defaultAmount(invoice, merchant);

  return parseFloat(amount.toFixed(5));

}

async function convertDollars(dollarAmount: number, currency: string): Promise<number> {

  console.log(`convert dollars ${dollarAmount} ${currency}`);

  const dollarPrice = await getDollarPrice(currency);

  const amount = parseFloat((dollarAmount / dollarPrice).toFixed(8));

  return amount;
}

export {
  convertDollars,
  computeCustomerCashBackAmountForInvoice
}

