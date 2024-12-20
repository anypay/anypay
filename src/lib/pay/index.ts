//@ts-ignore
import * as BIP70Protocol from 'bip70-payment-protocol';

export { BIP70Protocol }

import { VerifyPayment, PaymentOutput, PaymentOption, Currency, PaymentRequest, GetCurrency } from '@/lib/pay/types';

export { VerifyPayment, PaymentOutput, PaymentOption, Currency, PaymentRequest }

import { Transaction } from '@/lib/plugin'

import { log } from '@/lib/log'


import { invoices as Invoice } from '@prisma/client'

import { getBitcore } from '@/lib/bitcore';

import { sendWebhookForInvoice } from '@/lib/webhooks';

import InvoicePaidEvent from '@/webhooks/schemas/InvoicePaidEvent';

import * as bip70 from '@/lib/pay/bip70';

import * as bip270 from '@/lib/pay/bip_270';

import * as jsonV2 from '@/lib/pay/json_v2';

import * as fees from '@/lib/pay/fees';

import { publish } from 'rabbi'

export { fees, bip70, bip270, jsonV2 }

import { parsePayments } from '@/lib/plugins'

import { publishEvent, registerSchema } from '@/lib/amqp';

import prisma from '@/lib/prisma';

import PaymentConfirmingEvent from '@/webhooks/schemas/PaymentConfirmingEvent';

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

export function detectWallet(headers: { [x: string]: any; }, invoice_uid: any): string | undefined {

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

  let bitcore = getBitcore(v.payment_option.chain || v.payment_option.currency)

  let tx = new bitcore.Transaction(v.transaction.txhex);

  let txOutputs = tx.outputs.map((output: { script: any; satoshis: any; }) => {

    try {

      let address = new bitcore.Address(output.script).toString()

      if (address.match(':')) {
        address = address.split(':')[1]
      }

      return {
        address,
        amount: output.satoshis
      }

    } catch(error: any) {

      log.error(`payment.verify.error`, error)

      return null

    }

  })
  .filter((n: null) => n != null)

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
      address = output && output.address ? output.address.split(':')[1] : null
    }

    verifyOutput(txOutputs, address, output.amount);
  }

  return true

}

export async function buildPaymentRequestForInvoice(params: PaymentRequestForInvoice): Promise<PaymentRequest> {

  log.info('paymentrequest.build', params)

  const paymentOption = await prisma.payment_options.findFirstOrThrow({
    where: {
      invoice_uid: params.uid,
      currency: params.currency
    }
  })
  
  let invoice = await prisma.invoices.findFirstOrThrow({
    where: {
      uid: params.uid
    }
  })

  let paymentRequest = await buildPaymentRequest({
    paymentOption: {
      invoice_uid: paymentOption.invoice_uid,
      chain: paymentOption.chain,
      currency: paymentOption.currency,
      address: String(paymentOption.address),
      amount: Number(paymentOption.amount),
      outputs: paymentOption.outputs as any[],
      protocol: params.protocol,

    },
    invoice
  });

  log.info('paymentrequest', paymentRequest)

  return paymentRequest

}

interface BuildPaymentRequest {
  paymentOption: PaymentOption;
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
      memo: String(invoice.memo)
    });

    break;

  case 'BIP270':

    content = await bip270.buildPaymentRequest(paymentOption, {
      memo: String(invoice.memo)
    });
    break;

  case 'JSONV2':

    content = await jsonV2.buildPaymentRequest(paymentOption, {
      memo: String(invoice.memo)
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

export function verifyOutput(outputs: any[], targetAddress: any, targetAmount: number) {

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

registerSchema('payment.confirming', PaymentConfirmingEvent)

export async function handleUnconfirmedPayment(paymentOption: { id?: any; amount?: any; currency: any; address?: any; chain?: any; invoice_uid?: any; }, transaction: Transaction) {

  const { txhex } = transaction

  const { currency, chain, invoice_uid } = paymentOption

  log.info('handleUnconfirmedPayment', {invoice_uid, currency, transaction })

  let bitcore = getBitcore(chain)

  let tx = new bitcore.Transaction(txhex)

  const invoice = await prisma.invoices.findFirstOrThrow({
    where: {
      uid: invoice_uid
    }
  })

  const txid = transaction.txid || tx.hash
  
  const paymentRecord = await prisma.payments.create({
    data: {
      txid,
      currency,
      chain: chain || currency,
      txhex: txhex,
      tx_key: transaction.txkey,
      payment_option_id: paymentOption.id,
      invoice_uid: invoice_uid,
      account_id: invoice.account_id,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  await prisma.invoices.update({
    where: { id: invoice.id },
    data: {
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
    }
  });

  log.info('payment.confirming', paymentRecord)

  publish('payment.confirming', paymentRecord)

  return paymentRecord

}

export async function completePayment(paymentOption: { id?: any; amount?: any; currency: any; address?: any; chain?: any; invoice_uid?: any; }, transaction: Transaction, confirming: Boolean=false) {

  var { txhex, txid } = transaction

  var { currency, chain, invoice_uid } = paymentOption

  log.info('completePayment', {invoice_uid, currency, transaction })

  if (!chain) { chain = currency }

  if (!txid) {

    if (txhex.length == 66) {

      txid = txhex

    } else {

      txid = (await parsePayments({ chain, currency, transaction }))[0].txid

    }

  }

  let invoice = await prisma.invoices.findFirstOrThrow({
    where: {
      uid: invoice_uid
    }
  })
  
  const paymentRecord = await prisma.payments.create({
    data: {
      txid,
      currency,
      chain: chain || currency,
      txhex: txhex,
      tx_key: transaction.txkey,
      payment_option_id: paymentOption.id,
      invoice_uid: invoice_uid,
      account_id: invoice.account_id,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  await prisma.invoices.update({
    where: { id: invoice.id },
    data: {
      invoice_amount: paymentOption.amount,
      invoice_amount_paid: paymentOption.amount,
      invoice_currency: currency,
      denomination_amount_paid: invoice.denomination_amount,
      currency: paymentOption.currency,
      address: paymentOption.address,
      hash: txid,
      status: confirming ? 'confirming' : 'paid',
      paidAt: new Date(),
      complete: true,
      completed_at: new Date()
    }
  });

  invoice = await prisma.invoices.findFirstOrThrow({
    where: {
      uid: invoice_uid
    }
  })

  publishEvent<InvoicePaidEvent>('invoice.paid', {
    topic: 'invoice.paid',
    payload: {
      account_id: invoice.account_id || undefined,
      app_id: invoice.app_id || undefined,
      invoice: {
        uid: invoice.uid,
        status: invoice.status
      },
      payment: {
        chain: chain,
        currency: currency,
        txid: txid,
        status: 'paid'
      }
    }
  })

  sendWebhookForInvoice(invoice.uid, 'api_on_complete_payment')

  return paymentRecord

}

