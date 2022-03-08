import * as BIP70Protocol from '../../vendor/bitcore-payment-protocol';

export { BIP70Protocol }

import { VerifyPayment, PaymentOutput, PaymentOption, Currency, PaymentRequest, GetCurrency } from './types';
export { VerifyPayment, PaymentOutput, PaymentOption, Currency, PaymentRequest }

import { log, logError, logInfo } from '../logger'
import { awaitChannel } from '../amqp'
import { models } from '../models'

import {events} from '../events';

import { getBitcore } from '../bitcore';
import { sendWebhookForInvoice } from '../webhooks';

import { BigNumber } from 'bignumber.js';

import { broadcast } from './broadcast'

import * as bip70 from './bip70';
import * as bip270 from './bip_270';
import * as jsonV2 from './json_v2';

import * as fees from './fees';

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
    logInfo('wallet.detected', { wallet, invoice_uid })
  }

  return wallet

}

export async function verifyPayment(v: VerifyPayment) {

  log.info(`verifypayment`, v)

  let bitcore = getBitcore(v.payment_option.currency)

  let tx = new bitcore.Transaction(v.hex);

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

      logError(`verifypayment.error`, error)

      return null

    }

  })
  .filter(n => n != null)

  log.info("verifypayment.txoutputs", txOutputs);

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

}

export async function buildPaymentRequestForInvoice(params: PaymentRequestForInvoice): Promise<PaymentRequest> {

  logInfo('paymentrequest.build', params)

  let paymentOption = await models.PaymentOption.findOne({
    where: {
      invoice_uid: params.uid,
      currency: params.currency
    }
  });

  logInfo('paymentrequest.paymentoption', paymentOption.toJSON())

  let paymentRequest = await  buildPaymentRequest(Object.assign(paymentOption, { protocol: params.protocol}));

  logInfo('paymentrequest', paymentRequest)

  return paymentRequest

}

export async function buildPaymentRequest(paymentOption): Promise<PaymentRequest> {

  var content;

  switch(paymentOption.protocol) {

  case 'BIP70':

    content = await  bip70.buildPaymentRequest(paymentOption);
    break;

  case 'BIP270':

    content = await bip270.buildPaymentRequest(paymentOption);
    break;

  case 'JSONV2':

    content = await jsonV2.buildPaymentRequest(paymentOption);
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

export async function completePayment(paymentOption, hex: string) {

  log.info('paymentoption', paymentOption.toJSON())

  let bitcore = getBitcore(paymentOption.currency)

  let tx = new bitcore.Transaction(hex)

  let invoice = await models.Invoice.findOne({ where: {
    uid: paymentOption.invoice_uid
  }})
  
  let payment = {
    txid: tx.hash,
    currency: paymentOption.currency,
    txjson: tx.toJSON(),
    txhex: hex,
    payment_option_id: paymentOption.id,
    invoice_uid: paymentOption.invoice_uid,
    account_id: invoice.account_id
  }

  log.info('payment', payment)

  let paymentRecord = await models.Payment.create(payment)

  var result = await models.Invoice.update(
    {
      amount_paid: invoice.amount,
      invoice_amount: paymentOption.amount,
      invoice_amount_paid: paymentOption.amount,
      invoice_currency: paymentOption.currency,
      denomination_amount_paid: invoice.denomination_amount,
      currency: paymentOption.currency,
      address: paymentOption.address,
      hash: tx.hash,
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

  events.emit('invoice.paid', invoice)
  events.emit('invoice.payment', invoice.uid)

  let channel = await awaitChannel()

  channel.publish('anypay:invoices', 'invoice:paid', Buffer.from(invoice.uid))

  sendWebhookForInvoice(invoice.uid, 'api_on_complete_payment')

  return paymentRecord

}

export async function completeLNPayment(paymentOption, r_hash: string) {
  log.info('paymentoption', paymentOption.toJSON())

  let payment = {
    txid: r_hash,
    currency: paymentOption.currency,
    payment_option_id: paymentOption.id,
    invoice_uid: paymentOption.invoice_uid
  }

  log.info('payment', payment)

  let paymentRecord = await models.Payment.create(payment)

  let invoice = await models.Invoice.findOne({ where: {
    uid: paymentOption.invoice_uid
  }})

  var result = await models.Invoice.update(
    {
      amount_paid: invoice.amount,
      invoice_amount: paymentOption.amount,
      invoice_amount_paid: paymentOption.amount,
      invoice_currency: paymentOption.currency,
      denomination_amount_paid: invoice.denomination_amount,
      currency: paymentOption.currency,
      address: paymentOption.address,
      hash: r_hash,
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

  events.emit('invoice.paid', invoice)
  events.emit('invoice.payment', invoice.uid)

  let channel = await awaitChannel()

  channel.publish('anypay:invoices', 'invoice:paid', Buffer.from(invoice.uid))

  sendWebhookForInvoice(invoice.uid, 'api_on_complete_payment')

  return paymentRecord

}

const SATOSHIS = 100000000

export function toSatoshis(decimal: number): number {

  return (new BigNumber(decimal)).times(SATOSHIS).toNumber()

}

export { broadcast }

export function fromSatoshis(integer: number): number {

  return (new BigNumber(integer)).dividedBy(SATOSHIS).toNumber()

}

