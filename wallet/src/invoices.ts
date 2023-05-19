
import axios from 'axios'

import config from './config'

const base = config.get('api_base') || 'https://api.anypayx.com'

import { log } from './log'

import anypay from './anypay'

export async function listUnpaid(): Promise<any[]> {

  try {

    let { data } = await axios.get(`${base}/v1/api/apps/wallet-bot/invoices?status=unpaid`, {
      auth: {
        username: config.get('anypay_access_token'),
        password: ''
      }
    })
  
    return data.invoices

  } catch(error) {

    log.error('invoices.listUnpaid.error', error)

    return []
  }

}

interface NewInvoice {
  currency: string;
  address: string;
  value: number;
  denomination: string;
}

export async function createInvoice(params: NewInvoice): Promise<any> {

  const { currency, address, denomination, value } = params

  const paymentRequest = await anypay.request([{
    currency,
    to: [{
      address,
      amount: value,
      currency: denomination
    }]
  }])

  return paymentRequest

}
