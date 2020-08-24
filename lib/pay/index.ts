import * as BIP70Protocol from '../../vendor/bitcore-payment-protocol';

export { BIP70Protocol }

import { VerifyPayment, PaymentOutput, PaymentOption, Currency, PaymentRequest, GetCurrency } from './types';
export { VerifyPayment, PaymentOutput, PaymentOption, Currency, PaymentRequest }

import { log } from '../logger'
import { models } from '../models'

import {emitter} from '../events';

import { getBitcore } from '../bitcore';

import { BigNumber } from 'bignumber.js';

import { broadcast } from './broadcast'

import * as bip70 from './bip70';
import * as bip270 from './bip_270';
import * as jsonV2 from './json_v2';

import * as fees from './fees';

export { fees }


interface PaymentRequestForInvoice {
  uid: string;
  currency: string;
  protocol: string;
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

      log.error(`verifypayment.error`, error.message)

      return null

    }

  })
  .filter(n => n != null)

  log.info("verifypayment.txoutputs", txOutputs);

  let outputs: PaymentOutput[] = await buildOutputs(v.payment_option, v.protocol);

  for (let output of outputs) {

    if (output.address.match(':')) {
      output.address = output.address.split(':')[1]
    }

    verifyOutput(txOutputs, output.address, output.amount);
  }

}

export async function buildPaymentRequestForInvoice(params: PaymentRequestForInvoice): Promise<PaymentRequest> {

  log.info('paymentrequest.build', params)

  let paymentOption = await models.PaymentOption.findOne({
    where: {
      invoice_uid: params.uid,
      currency: params.currency
    }
  });

  log.info('paymentrequest.paymentoption', paymentOption.toJSON())

  let paymentRequest = await  buildPaymentRequest(Object.assign(paymentOption, { protocol: params.protocol}));

  log.info('paymentrequest', paymentRequest)

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
  
  let payment = {
    txid: tx.hash,
    currency: paymentOption.currency,
    txjson: tx.toJSON(),
    txhex: hex,
    payment_option_id: paymentOption.id,
    invoice_uid: paymentOption.invoice_uid
  }

  console.log('PAYMENT', payment)

  let paymentRecord = await models.Payment.create(payment)

  let invoice = await models.Invoice.findOne({ where: {
    uid: paymentOption.invoice_uid
  }})

  var result = await models.Invoice.update(
    {
      amount_paid: invoice.amount,
      invoice_amount_paid: invoice.invoice_amount,
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

  emitter.emit('invoice.paid', invoice)
  emitter.emit('invoice.payment', invoice.uid)

}

const SATOSHIS = 100000000

export function toSatoshis(decimal: number): number {

  return (new BigNumber(decimal)).times(SATOSHIS).toNumber()

}

export { broadcast }

export function fromSatoshis(integer: number): number {

  return (new BigNumber(integer)).dividedBy(SATOSHIS).toNumber()

}

