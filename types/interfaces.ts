
export interface Payment {
  currency: string;
  address: string;
  amount: number;
  hash: string;
}

export interface Invoice {
  id: number;
  uid: string;
  account_id: number;
  currency: string;
  amount: number;
  amount_paid?: number;
  denomination: string;
  denomination_amount: number;
  address: string;
  status: string;
  hash?: string;
  paidAt?: Date;
}

export interface Oracle {
  name: string;
  registerAddress: (address: string) => Promise<string>;
  deregisterAddress: (address: string) => Promise<boolean>;
}

export interface AccountInvoice extends Invoice {
  account_id: number;
}

export interface PaidInvoice extends Invoice {
  paid_amount: number;
}


