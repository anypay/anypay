
export interface Payment {
  currency: string;
  address: string;
  amount: number;
  hash: string;
}

export interface Invoice {
  currency: string;
  amount: number;
  denomination: string;
  denomination_amount: number;
  address: string;
  status: string;
}

export interface AccountInvoice extends Invoice {
  account_id: number;
}

export interface PaidInvoice extends Invoice {
  paid_amount: number;
}


