
interface ProtocolMessage {}

export interface PaymentOptionsHeaders {
  Accept: string;
  'x-paypro-version': number;
}

export interface PaymentOption {
  chain: string;
  currency: string;
  network: string;
  estimatedAmount: number;
  requiredFeeRate: number;
  minerFee: number;
  decimals: number;
  selected: boolean;
}

export interface PaymentOptions extends ProtocolMessage {
  time: string;
  expires: string;
  memo: string;
  paymentUrl: string;
  paymentId: string;
  paymentOptions: PaymentOption[];
}

export interface SelectPaymentRequestHeaders {
  'Content-Type': string;
  'x-paypro-version': 2;
}

export interface SelectPaymentRequest extends ProtocolMessage {
  chain: string;
  currency: string;
}

export interface Output {
  amount: number;
  address: string;
}

export interface XrpOutput extends Output {
  invoiceID: string;
}

export interface UtxoInstruction {
  type: string;
  requiredFeeRate: number;
  outputs: Output[];
}

export interface XrpInstruction {
  type: string;
  outputs: XrpOutput[];
}

export type Instruction = UtxoInstruction | XrpInstruction

export interface PaymentRequest extends ProtocolMessage {
  time: string;
  expires: string;
  memo: string;
  paymentUrl: string;
  paymentId: string;
  chain: string;
  network: string;
  instructions: Instruction[];
}

export interface PaymentVerificationRequest {
  chain: string;
  currency: string;
  transactions: Transaction[];
}

export interface SendPayment {
  chain: string;
  currency: string;
  transactions: Transaction[];
}

export interface PaymentVerification {
  payment: Payment;
  memo: string;
}

export interface Transaction {
  tx: string;
  weightedSize?: number;
  tx_key?: string;
  tx_hash?: string;
}

export interface Payment {
  chain: string;
  currency: string;
  transactions: Transaction[];
}

export interface PaymentResponse {
  payment: Payment;
  memo: string;
}

