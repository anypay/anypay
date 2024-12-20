import { Transaction } from '@/lib/plugin'

export interface Currency {
  name: string;
  code: string;
}

export interface PaymentOption {
  invoice_uid: string;
  chain: string;
  currency: string;
  address: string | null;
  amount?: number;
  protocol?: string;
  fee?: number;
  createdAt?: Date;
  outputs: PaymentOutput[];
}

export interface VerifyPayment {
  payment_option: PaymentOption;
  transaction: Transaction;
  protocol: string; // BIP70, BIP270, JSONV2
}

export interface PaymentOutput {
  amount: number;
  address?: string;
  script?: string;
}

export interface PaymentRequest {
  uid: string;
  protocol: string;
  content: any
}

export interface GetCurrency {
  protocol: string;
  headers: any;
}

