
import { Invoice } from '../../invoices'

import { findPaymentOption } from '../../payment_option'

import { submitPayment } from '../../../server/payment_requests/handlers/json_payment_requests'

import { log } from '../../log'

import { Protocol } from './schema'

import { plugins } from '../../plugins'

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
  tx_key?: string;
  tx_hash?: string;
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

interface LogOptions {
  wallet?: string;
}

export async function listPaymentOptions(invoice: Invoice, options: LogOptions = {}): Promise<PaymentOptions> {

  log.info('pay.jsonv2.payment-options', Object.assign(options, {
    invoice_uid: invoice.uid,
    account_id: invoice.get('account_id')
  }))

  let paymentOptions = await invoice.getPaymentOptions()

  return {

    time: invoice.get('createdAt'),

    expires: invoice.get('expiry'),

    memo: `Anypay Invoice ID: ${invoice.uid}`,

    paymentUrl: `https://api.anypayinc.com/i/${invoice.uid}`,

    paymentId: invoice.uid,

    paymentOptions: paymentOptions.map(paymentOption => {

      const estimatedAmount = paymentOption.get('outputs')
        .reduce((sum, output) => sum + output.amount, 0)

      return {
        currency: paymentOption.get('currency'),
        chain: paymentOption.get('currency'),
        network: 'main',
        estimatedAmount,
        requiredFeeRate: 1,
        minerFee: 0,
        decimals: 0,
        selected: false
      }
    })
  }
}

export async function getPaymentRequest(invoice: Invoice, option: SelectPaymentRequest, options: LogOptions = {}): Promise<PaymentRequest> {

  if (invoice.status !== 'unpaid') {
    throw new Error(`Invoice With Status ${invoice.status} Cannot Be Paid`)
  }

  log.info('pay.jsonv2.payment-request', Object.assign(Object.assign(option, options), {
    account_id: invoice.get('account_id'),
    invoice_uid: invoice.uid
  }))

  await Protocol.PaymentRequest.request.validateAsync(option, { allowUnknown: true })

  let paymentOption = await findPaymentOption(invoice, option.currency)

  return {

    time: invoice.get('createdAt'),

    expires: invoice.get('expiry'),

    memo: 'string',

    paymentUrl: `https://api.anypayinc.com/i/${invoice.uid}`,

    paymentId: invoice.uid,

    chain: option.chain,

    network: 'main',

    instructions: [{

      type: "transaction",

      requiredFeeRate: 1,

      outputs: paymentOption.get('outputs')

    }]

  }

}

export async function verifyUnsignedPayment(invoice: Invoice, params: PaymentVerificationRequest, options: LogOptions = {}): Promise<PaymentVerification> {

  log.info('pay.jsonv2.payment-verification', Object.assign({
    invoice_uid: invoice.uid,
    account_id: invoice.get('account_id')
  }, Object.assign(params, options)))

  await Protocol.PaymentVerification.request.validateAsync(params, { allowUnknown: true })

  let plugin = await plugins.findForCurrency(params.currency)

  if (plugin.validateUnsignedTx) {

    await plugin.validateUnsignedTx(params.transactions[0].tx)

  }

  return {
    payment: params,
    memo: 'Transaction Pre-Validation Skipped'
  }

}

export async function sendSignedPayment(invoice: Invoice, params: PaymentVerificationRequest, options: LogOptions = {}): Promise<PaymentResponse> {

  log.info('pay.jsonv2.payment', Object.assign({
    invoice_uid: invoice.uid,
    account_id: invoice.get('account_id')
  }, Object.assign(params, options)))

  await Protocol.Payment.request.validateAsync(params, { allowUnknown: true })

  if (params.currency === 'XMR') {

    for (let tx of params.transactions) {

      if (!tx.tx_key || !tx.tx_hash) {

        throw new Error('tx_key and tx_hash required for all XMR transactions')

      }

    }
    
  }

  try {

    let response = await submitPayment({
      currency: params.currency,
      transactions: params.transactions.map(({tx}) => tx),
      invoice_uid: invoice.uid
    })

    log.info('pay.jsonv2.payment.submit.response', Object.assign(response, {
      invoice_uid: invoice.uid,
      account_id: invoice.get('account_id')
    }))

    return {
      payment: params,
      memo: 'Transactions accepted and broadcast to the network'
    }

  } catch(error) {

    log.info('pay.jsonv2.payment.error', Object.assign(options, {
      error: error.message,
      invoice_uid: invoice.uid,
      account_id: invoice.get('account_id')
    }))

    throw error

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

