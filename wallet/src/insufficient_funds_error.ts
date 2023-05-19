
export class InsufficientFundsError extends Error {
  currency: string;
  address: string;
  paymentRequest: any;
  balance: number;
  required: number;

  constructor({
    currency,
    address,
    paymentRequest,
    balance,
    required
  }: {
    currency: string,
    address: string,
    paymentRequest: any,
    balance: number,
    required: number})
  {
    super()

    this.currency = currency;
    this.address = address;
    this.balance = balance;
    this.required = required;
    this.paymentRequest = paymentRequest

    this.message = `Insufficient ${currency} Balance of ${balance} in ${address}: ${required} required`
  }

}
