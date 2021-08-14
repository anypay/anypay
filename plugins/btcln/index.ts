
import { logInfo } from '../../lib/logger'

import { fromSatoshis } from '../../lib/pay'

import {generateInvoice} from '../../lib/invoice';

import * as http from 'superagent'

interface Payment{
  amount: number;
  hash: string;
  currency: string;
  address: string;
  invoice_uid?: string;
}

export async function createInvoice(accountId: number, amount: number) {

  let start = new Date().getTime()

  let invoice = await generateInvoice(accountId, amount, 'BTCLN');

  return invoice;

}

export async function getNewAddress(account, amount) {

  logInfo('btcln.getnewaddress', {account, amount})

  let response = await http
    .post('https://lnd.anypayx.com/invoices')
    .send({
      amount
    })

  logInfo('btcln.getnewaddress.result', response.body.payment_request)

  return response.body.payment_request

}

export const currency = 'BTCLN'

