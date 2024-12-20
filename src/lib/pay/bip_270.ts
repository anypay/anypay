
import { PaymentOutput, PaymentOption, GetCurrency, Currency } from '@/lib/pay/types';

import { getBitcore } from '@/lib/bitcore';

import moment from 'moment';

import { config } from '@/lib/config'

export function getCurrency(params: GetCurrency): Currency {

  return {
    name: 'bitcoinsv',
    code: 'BSV'
  }
}

export async function buildOutputs(paymentOption: PaymentOption): Promise<PaymentOutput[]> {

  let bitcore = getBitcore(paymentOption.currency);
  
  if (!paymentOption.outputs || paymentOption.outputs?.length === 0) {  
    return []
  }

  let outputs = paymentOption.outputs.map(output => {

    let address = new bitcore.Address(output.address);
    let script = new bitcore.Script(address);

    return {
      script: script.toHex(),
      amount: output.amount
    }

  });

  return outputs;

}

interface Bip270PaymentRequest {
  network: string;
  outputs: any[],
  creationTimestamp: number;
  expirationTimestamp: number;
  memo: string
  paymentUrl: string;
  merchantData: string;
}

export async function getMerchantData(invoiceUid: string, account_id?: number): Promise<string> {

  if (!account_id) {
    return JSON.stringify({ invoiceUid })
  }

  const invoice = await prisma.invoices.findFirstOrThrow({
    where: {
      uid: String(invoiceUid)
    }
  })

  const account = await prisma.accounts.findFirstOrThrow({
    where: {
      id: account_id
    }
  })

  if (invoice.metadata) {

    return JSON.stringify(Object.assign({ invoiceUid }, invoice.metadata))

  } else {

    var merchantName = account.business_name;
    var avatarUrl = account.image_url;

    return JSON.stringify({
      invoiceUid,
      merchantName,
      avatarUrl
    })

  }
}

import { PaymentRequestOptions } from './'
import prisma from '../prisma';

export async function buildPaymentRequest(paymentOption: PaymentOption, options: PaymentRequestOptions={}): Promise<Bip270PaymentRequest> {

  const invoice = await prisma.invoices.findFirstOrThrow({
    where: {
      uid: paymentOption.invoice_uid
    }
  })

  let merchantData = await getMerchantData(String (invoice.uid), Number(invoice.account_id))

  let outputs = await buildOutputs(paymentOption)

  let memo = invoice.memo || "Anypay™"

  let request: {
    network: string,
    outputs: any[],
    creationTimestamp: number,
    expirationTimestamp: number,
    memo: string,
    paymentUrl: string,
    merchantData: string
    redirectUrl?: string
  } = {
    network:"bitcoin-sv",
    outputs,
    creationTimestamp: moment(invoice.createdAt).unix(),
    expirationTimestamp: moment(invoice.expiry).unix(),
    memo,
    paymentUrl: `${config.get('API_BASE')}/r/${invoice.uid}/pay/BSV/bip270`,
    merchantData
  }

  if (invoice.redirect_url) {
    request['redirectUrl'] = invoice.redirect_url
  }

  return request

}

