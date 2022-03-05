
import { Invoice } from '../../invoices'

import { log } from './log'

interface ProtocolMessage {}

interface PaymentOptionsHeaders {
  Accept: string;
  'x-paypro-version': number;
}

interface PaymentOption {
  chain: string;
  currency: string;
  network: string;
  estimatedAmount: number;
  requiredFeeRate: number;
  minerFee: number;
  decimals: number;
  selected: boolean;
}

interface PaymentOptions extends ProtocolMessage {
  time: string;
  expires: string;
  memo: string;
  paymentUrl: string;
  paymentId: string;
  paymentOptions: PaymentOption[];
}

interface SelectPaymentRequestHeaders {
  'Content-Type': string;
  'x-paypro-version': 2;
}

interface SelectPaymentRequest extends ProtocolMessage {
  chain: string;
  currency: string;
}

interface Output {
  amount: number;
  address: string;
}

interface XrpOutput extends Output {
  invoiceID: string;
}

interface UtxoInstruction {
  type: string;
  requiredFeeRate: number;
  outputs: Output[];
}

interface EthInstruction {
  type: string;
  value: number;
  to: string;
  data: string;
  gasPrice: number;
}

interface XrpInstruction {
  type: string;
  outputs: XrpOutput[];
}

type Instruction = UtxoInstruction | EthInstruction | XrpInstruction

interface PaymentRequest extends ProtocolMessage {
  time: string;
  expires: string;
  memo: string;
  paymentUrl: string;
  paymentId: string;
  chain: string;
  network: string;
  instructions: Instruction[];
}

interface PaymentVerificationRequest {
  chain: string;
  currency: string;
  transactions: Transaction[];
}

interface PaymentVerification {
  payment: Payment;
  memo: string;
}

interface Transaction {
  tx: string;
  weightedSize?: number;
}

interface Payment {
  chain: string;
  currency: string;
  transactions: Transaction[];
}

interface PaymentResponse {
  payment: Payment;
  memo: string;
}

const Errors = require('./errors').errors

export async function listPaymentOptions(invoice: Invoice): Promise<PaymentOptions> {

  let paymentOptions = await invoice.getPaymentOptions()

  return {

    time: invoice.get('createdAt'),

    expires: invoice.get('expiry'),

    memo: 'string',

    paymentUrl: `https://anypayx.com/i/${invoice.uid}`,

    paymentId: invoice.uid,

    paymentOptions: paymentOptions.map(paymentOption => {
      return {
        currency: paymentOption.get('currency'),
        chain: paymentOption.get('currency'),
        network: 'main',
        estimatedAmount: paymentOption.get('amount'),
        requiredFeeRate: 1,
        minerFee: 0,
        decimals: 0,
        selected: false
      }
    })
  }
}

export async function getPaymentRequest(invoice: Invoice, option: SelectPaymentRequest): Promise<PaymentRequest> {

  return {

    time: invoice.get('createdAt'),

    expires: invoice.get('expiry'),

    memo: 'string',

    paymentUrl: `https://anypayx.com/i/${invoice.uid}`,

    paymentId: invoice.uid,

    chain: option.chain,

    network: 'main',

    instructions: [{
      type: "transaction",
      requiredFeeRate: 1,
      outputs: []
    }]

  }

}

export async function verifyUnsignedPayment(invoice: Invoice, params: PaymentVerificationRequest): Promise<PaymentVerification> {

  return {
    payment: params,
    memo: 'Transactions appear to be valid please proceed'
  }

}

export async function sendSignedPayment(invoice: Invoice, params: PaymentVerificationRequest): Promise<PaymentResponse> {

  log.info('payment', Object.assign({ invoice_uid: invoice.uid }, params))

  return {
    payment: params,
    memo: 'Transactions accepted and broadcast to the network'
  }
}

interface Log {
  info: Function;
  error: Function;
}

class PaymentProtocol {

  invoice: Invoice;

  log: Log;

  constructor(invoice: Invoice) {

    this.invoice = invoice

    this.log = {

      info: (event, payload) => {

        return log.info(event, Object.assign({ invoice_uid: invoice.uid }, payload))

      },

      error: log.error
    }

  }

  listPaymentOptions() {

    return listPaymentOptions(this.invoice)

  }

  sendSignedPayment(params) {

    return sendSignedPayment(this.invoice, params)

  }

}

