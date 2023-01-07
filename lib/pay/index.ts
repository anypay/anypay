import * as BIP70Protocol from 'bip70-payment-protocol';

export { BIP70Protocol }

import { VerifyPayment, PaymentOutput, PaymentOption, Currency, PaymentRequest, GetCurrency } from './types';
export { VerifyPayment, PaymentOutput, PaymentOption, Currency, PaymentRequest }

import { log } from '../log'

import { Invoice, ensureInvoice } from '../invoices'

import { awaitChannel } from '../amqp'
import { models } from '../models'

import { getBitcore } from '../bitcore';
import { sendWebhookForInvoice } from '../webhooks';

import { BigNumber } from 'bignumber.js';

import { broadcast } from './broadcast'

import * as bip70 from './bip70';
import * as bip270 from './bip_270';
import * as jsonV2 from './json_v2';

import * as fees from './fees';

import { publish } from 'rabbi'

export { fees, bip70, bip270, jsonV2 }

export interface Payment{
  amount: number;
  hash: string;
  currency: string;
  address: string;
}

interface PaymentRequestForInvoice {
  uid: string;
  currency: string;
  protocol: string;
}

export enum Wallets {
  Edge = 'edge',
  BitcoinCom = 'bitcoin.com',
  Badger = 'badger',
  Handcash = 'handcash',
  SimpyCash = 'simply.cash',
  Dash = 'dash',
  ElectrumSV = 'electrum sv',
  ElectronCash = 'electron cash',
  Electrum = 'electurm',
  Mycelium = 'mycelium',
  Copay = 'copay',
}

export function detectWallet(headers, invoice_uid): string {

  var wallet; 

  switch(headers['x-requested-with']){ 
    case 'co.edgesecure.app':
      wallet = Wallets.Edge
      break;
    case 'cash.simply.wallet':
      wallet = Wallets.SimpyCash
      break;
    default:
  }

  if (wallet) {
    log.info('wallet.detected', { wallet, invoice_uid })
  }

  return wallet

}

export async function verifyPayment(v: VerifyPayment): Promise<boolean> {

  log.info(`payment.verify`, v)

  let bitcore = getBitcore(v.payment_option.currency)

  let tx = new bitcore.Transaction(v.transaction.tx);

  let txOutputs = tx.outputs.map(output => {

    try {

      let address = new bitcore.Address(output.script).toString()

      if (address.match(':')) {
        address = address.split(':')[1]
      }

      return {
        address,
        amount: output.satoshis
      }

    } catch(error) {

      log.error(`payment.verify.error`, error)

      return null

    }

  })
  .filter(n => n != null)

  log.info("payment.verify.txoutputs", txOutputs);

  let outputs: PaymentOutput[] = await buildOutputs(v.payment_option, 'JSONV2');

  for (let output of outputs) {

    log.info('output', output)

    var address;

    if (output.script) {

      address = new bitcore.Address(output.script).toString()

    } else {

      address = output.address

    }

    if (address.match(':')) {
      address = output.address.split(':')[1]
    }

    verifyOutput(txOutputs, address, output.amount);
  }

  return true

}

export async function buildPaymentRequestForInvoice(params: PaymentRequestForInvoice): Promise<PaymentRequest> {

  log.info('paymentrequest.build', params)

  let paymentOption = await models.PaymentOption.findOne({
    where: {
      invoice_uid: params.uid,
      currency: params.currency
    }
  });

  if (!paymentOption) {

    const error = new Error('payment option not found')

    log.error('payment-option.missing', error)

    throw error
  }
  
  let invoice = await ensureInvoice(params.uid)

  paymentOption = Object.assign(paymentOption, {
    protocol: params.protocol
  })

  let paymentRequest = await buildPaymentRequest({
    paymentOption,
    invoice
  });

  log.info('paymentrequest', paymentRequest)

  return paymentRequest

}

interface BuildPaymentRequest {
  paymentOption: any;
  invoice: Invoice;
}

export interface PaymentRequestOptions {
  memo?: string;
  time?: number;
  expires?: number;
  payment_url?: string;
  fee_rate_level?: string;
}


export async function buildPaymentRequest({paymentOption, invoice}: BuildPaymentRequest): Promise<PaymentRequest> {

  var content;

  switch(paymentOption.protocol) {

  case 'BIP70':

    content = await  bip70.buildPaymentRequest(paymentOption, {
      memo: invoice.get('memo')
    });

    break;

  case 'BIP270':

    content = await bip270.buildPaymentRequest(paymentOption, {
      memo: invoice.get('memo')
    });
    break;

  case 'JSONV2':

    content = await jsonV2.buildPaymentRequest(paymentOption, {
      memo: invoice.get('memo')
    });
    break;

  default:

    throw new Error(`protocol ${paymentOption.protocol} not supported`)

  }

  return {
    uid: paymentOption.invoice_uid,
    protocol: paymentOption.protocol,
    content
  }

}

export function getCurrency(params: GetCurrency): Currency {

  switch(params.protocol) {

  case 'BIP70':

    return bip70.getCurrency(params)

  case 'BIP270':

    return bip270.getCurrency(params)

  case 'JSONV2':

    return jsonV2.getCurrency(params);

  default:

    throw new Error(`protocol ${params.protocol} not supported`)

  }

}

export async function buildOutputs(paymentOption: PaymentOption, protocol: string): Promise<any[]> {

  switch(protocol) {

  case 'BIP70':

    return bip70.buildOutputs(paymentOption);

  case 'BIP270':

    return bip270.buildOutputs(paymentOption);

  case 'JSONV2':

    return jsonV2.buildOutputs(paymentOption);

  default:

    throw new Error(`protocol ${paymentOption.protocol} not supported`)

  }

}

export function verifyOutput(outputs, targetAddress, targetAmount) {

  log.info('verifyoutput', {
    outputs,
    targetAddress,
    targetAmount
  })

  let matchingOutput = outputs.filter(output => {

    return output.address === targetAddress && output.amount === targetAmount;

  });

  if (matchingOutput.length === 0) {
    throw new Error(`Missing required output ${targetAddress} ${targetAmount}`) 
  }

  log.info('output.verified', {
    address: targetAddress,
    amount: targetAmount
  })

}

interface Transaction {
  tx: string;
  tx_hash?: string;
  tx_key?: string;
}

export async function handleUnconfirmedPayment(paymentOption, transaction: Transaction) {

  const {tx: hex} = transaction

  const { currency, invoice_uid } = paymentOption

  log.info('handleUnconfirmedPayment', {invoice_uid, currency, transaction })

  let bitcore = getBitcore(currency)

  let tx = new bitcore.Transaction(hex)

  let invoice = await models.Invoice.findOne({ where: {
    uid: invoice_uid
  }})

  const txid = transaction.tx_hash || tx.hash
  
  let paymentRecord = await models.Payment.create({
    txid,
    currency: currency,
    txjson: tx.toJSON(),
    txhex: hex,
    tx_key: transaction.tx_key,
    payment_option_id: paymentOption.id,
    invoice_uid: invoice_uid,
    account_id: invoice.account_id
  })

  await models.Invoice.update(
    {
      amount_paid: invoice.amount,
      invoice_amount: paymentOption.amount,
      invoice_amount_paid: paymentOption.amount,
      invoice_currency: currency,
      denomination_amount_paid: invoice.denomination_amount,
      currency: paymentOption.currency,
      address: paymentOption.address,
      hash: txid,
      status: 'confirming',
      paidAt: new Date(),
      complete: true,
      completed_at: new Date()
    },
    {
      where: { uid: paymentOption.invoice_uid }
    }
  );

  invoice = await models.Invoice.findOne({ where: {
    id: invoice.id
  }})

  log.info('payment.confirming', paymentRecord.toJSON())

  publish('anypay', 'payment.confirming', paymentRecord.toJSON())

  return paymentRecord

}

export async function completePayment(paymentOption, transaction: Transaction) {

  const {tx: hex} = transaction

  const { currency, invoice_uid } = paymentOption

  log.info('completePayment', {invoice_uid, currency, transaction })

  let bitcore = getBitcore(currency)

  let tx = new bitcore.Transaction(hex)

  let invoice = await models.Invoice.findOne({ where: {
    uid: invoice_uid
  }})

  const txid = transaction.tx_hash || tx.hash
  
  let paymentRecord = await models.Payment.create({
    txid,
    currency: currency,
    txjson: tx.toJSON(),
    txhex: hex,
    tx_key: transaction.tx_key,
    payment_option_id: paymentOption.id,
    invoice_uid: invoice_uid,
    account_id: invoice.account_id
  })

  await models.Invoice.update(
    {
      amount_paid: invoice.amount,
      invoice_amount: paymentOption.amount,
      invoice_amount_paid: paymentOption.amount,
      invoice_currency: currency,
      denomination_amount_paid: invoice.denomination_amount,
      currency: paymentOption.currency,
      address: paymentOption.address,
      hash: txid,
      status: 'paid',
      paidAt: new Date(),
      complete: true,
      completed_at: new Date()
    },
    {
      where: { uid: paymentOption.invoice_uid }
    }
  );

  invoice = await models.Invoice.findOne({ where: {
    id: invoice.id
  }})

  log.info('invoice.paid', invoice)

  let channel = await awaitChannel()

  channel.publish('anypay:invoices', 'invoice:paid', Buffer.from(invoice.uid))

  sendWebhookForInvoice(invoice.uid, 'api_on_complete_payment')

  return paymentRecord

}

const SATOSHIS = 100000000

export function toSatoshis(decimal: number, currency?: string): number {

  const satoshis = new BigNumber(decimal).times(SATOSHIS)
  
  if (currency === 'XMR') {

    return satoshis.times(10000).toNumber()

  } else {

    return satoshis.toNumber()

  }

}

export { broadcast }

export function fromSatoshis(integer: number): number {

  return (new BigNumber(integer)).dividedBy(SATOSHIS).toNumber()

}

