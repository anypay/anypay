
import { Invoice } from '../../invoices'

import { config } from '../../config'

import { findPaymentOption } from '../../payment_option'

import * as mempool from '../../mempool.space'

import { log } from '../../log'

import { Protocol } from './schema'

import { plugins } from '../../plugins'

import { models } from '../../models'

import { verifyPayment, completePayment  } from '../'

export interface SubmitPaymentRequest {
  currency: string;
  invoice_uid: string;
  transactions: string[];
  wallet?: string;
}

export interface SubmitPaymentResponse {
  success: boolean;
  transactions: string[];
}

export async function submitPayment(payment: SubmitPaymentRequest): Promise<SubmitPaymentResponse> {

  const { invoice_uid } = payment

  try {

    log.info('payment.submit', payment);

    let invoice = await models.Invoice.findOne({ where: { uid: invoice_uid }})

    if (invoice.cancelled) {

      const error = new Error('invoice cancelled')

      log.error('payment.error.invoicecancelled', error)

      throw error
      
    }

    if (!invoice) {
      throw new Error(`invoice ${payment.invoice_uid} not found`)
    }


    let payment_option = await models.PaymentOption.findOne({ where: {
      invoice_uid,
      currency: payment.currency
    }})

    if (!payment_option) {

      log.info('pay.jsonv2.payment.error.currency_unsupported', {
        invoice_uid,
        currency: payment.currency
      })

      throw new Error(`Unsupported Currency or Chain for Payment Option`)
    }

    let plugin = await plugins.findForCurrency(payment.currency)

    for (const transaction of payment.transactions) {

      const verify: Function = plugin.verifyPayment ? plugin.verifyPayment : verifyPayment

      const verified: boolean = await verify({
        payment_option,
        hex: transaction,
        protocol: 'JSONV2'
      })

      if (!verified) {
        
        log.info(`pay.jsonv2.${payment.currency.toLowerCase()}.verifyPayment.failed`, {
          invoice_uid: invoice.uid,
          hex: transaction,
          protocol: 'JSONV2'
        })

        throw new Error(`pay.jsonv2.${payment.currency.toLowerCase()}.verifyPayment.failed`)
      }

      log.info(`jsonv2.${payment.currency.toLowerCase()}.transaction.submit`, {invoice_uid, transaction })

      const response = await plugin.broadcastTx(transaction)

      log.info(`jsonv2.${payment.currency.toLowerCase()}.transaction.submit.response`, { invoice_uid, transaction, response })

      let paymentRecord = await completePayment(payment_option, transaction)

      if (payment.wallet) {
        paymentRecord.wallet = payment.wallet
        await paymentRecord.save()
      }

      log.info('payment.completed', paymentRecord);

    }

    return {
      success: true,
      transactions: payment.transactions
    }

  } catch(error) {

    log.error('pay.jsonv2.payment.error', error)

    throw error

  }

}

export async function verifyUnsigned(payment: SubmitPaymentRequest): Promise<SubmitPaymentResponse> {

  try {

    log.info('payment.unsigned.verify', payment);

    let invoice = await models.Invoice.findOne({ where: { uid: payment.invoice_uid }})

    if (invoice.cancelled) {

      const error = new Error('payment.error.invoice.cancelled')

      log.error('payment.error.invoice.cancelled', error)

      throw error
    }

    if (!invoice) {
      throw new Error(`invoice ${payment.invoice_uid} not found`)
    }

    let payment_option = await models.PaymentOption.findOne({ where: {
      invoice_uid: invoice.uid,
      currency: payment.currency
    }})

    if (!payment_option) {
      throw new Error(`Unsupported Currency or Chain for Payment Option`)
    }

    let plugin = await plugins.findForCurrency(payment.currency)

    if (plugin.validateUnsignedTx) {

      const valid = await plugin.validateUnsignedTx({
        payment_option,
        transactions: payment.transactions
      })

      if (valid) {
        
        return {
          success: true,
          transactions: payment.transactions
        }

      } else {

        throw new Error('Invalid unsigned transaction')
      }

    }

    for (const transaction of payment.transactions) {

      if (plugin.verifyPayment) {

        await plugin.verifyPayment({
          payment_option,
          hex: transaction,
          protocol: 'JSONV2'
        })

      } else {

        await verifyPayment({
          payment_option,
          hex: transaction,
          protocol: 'JSONV2'
        })

      }

      log.debug('payment.unsigned.verified', payment);

    }

    return {
      success: true,
      transactions: payment.transactions
    }

  } catch(error) {

    log.error('pay.jsonv2.payment.unsigned.verify.error', error)

    throw error

  }

}


interface ProtocolMessage {}

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

interface LogOptions {
  wallet?: string;
}

async function getRequiredFeeRate(invoice: Invoice, currency: string): Promise<number> {

  var requiredFeeRate = 1

  if (currency === 'BTC') {

    if (config.get('mempool_space_fees_enabled')) {

      const level = mempool.FeeLevels[invoice.get('fee_rate_level')]

      requiredFeeRate = await mempool.getFeeRate(level || mempool.FeeLevels.fastestFee)

    }

  }

  return requiredFeeRate

}

export async function listPaymentOptions(invoice: Invoice, options: LogOptions = {}): Promise<PaymentOptions> {

  log.info('pay.jsonv2.payment-options', Object.assign(options, {
    invoice_uid: invoice.uid,
    account_id: invoice.get('account_id')
  }))

  let _paymentOptions = await invoice.getPaymentOptions()

  let paymentOptions = await Promise.all(_paymentOptions.map(async paymentOption => {

    const estimatedAmount = paymentOption.get('outputs')
      .reduce((sum, output) => sum + output.amount, 0)

    var requiredFeeRate = await getRequiredFeeRate(invoice, paymentOption.currency)

    return {
      currency: paymentOption.get('currency'),
      chain: paymentOption.get('currency'),
      network: 'main',
      estimatedAmount,
      requiredFeeRate,
      minerFee: 0,
      decimals: 0,
      selected: false
    }

  }))

  return {

    time: invoice.get('createdAt'),

    expires: invoice.get('expiry'),

    memo: invoice.get('memo'),

    paymentUrl: `${config.get('API_BASE')}/i/${invoice.uid}`,

    paymentId: invoice.uid,

    paymentOptions

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

  const requiredFeeRate = await getRequiredFeeRate(invoice, option.currency)

  return {

    time: invoice.get('createdAt'),

    expires: invoice.get('expiry'),

    memo: invoice.get('memo'),

    paymentUrl: `${config.get('API_BASE')}/i/${invoice.uid}`,

    paymentId: invoice.uid,

    chain: option.chain,

    network: 'main',

    instructions: [{

      type: "transaction",

      requiredFeeRate,

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

  await verifyUnsigned({
    invoice_uid: invoice.uid,
    transactions: params.transactions.map(({tx}) => tx),
    currency: params.currency
  })

  return {
    payment: params,
    memo: 'Un-Signed Transaction Validated with Success'
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
