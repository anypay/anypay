
export interface Payment {
  currency: string;
  address: string;
  amount: number;
  hash: string;
  confirmations?: number;
}

export interface I_Address {
  id: number;
  account_id: number;
  currency: string;
  value: string;
  nonce?: number;
}

export interface Invoice {
  id: number;
  uid: string;
  account_id: number;
  currency: string;
  complete?: boolean;
  completed_at?: Date;
  instantsend?: boolean;
  amount: number;
  invoice_amount?: number;
  invoice_amount_paid?: number;
  amount_paid?: number;
  denomination: string;
  denomination_amount: number;
  denomination_amount_paid?: number;
  address: string;
  expiry?: string;
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


