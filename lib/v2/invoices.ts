
import * as shortid from 'shortid'
import { getCoin } from '../coins'

import { models } from '../models'

import { toSatoshis } from '../pay'
import { writePaymentOptions } from '../payment_options'
import { createAddressRoute } from '../routes'

interface CreateInvoice {
  currency: string;
  amount: number;
  uid?: string;
}

interface PaymentOption {
  invoice_uid: string;
  currency: string,
  uri: string;
  outputs: any[];
}

export class Invoice {
  model: any;
  payment_options: PaymentOption[]

  constructor(model) {
    this.model = model
    this.payment_options = []
  }

  toJSON() {
    return {
      currency: this.currency,
      amount: this.amount,
      uid: this.uid,
      uri: this.uri,
      web_url: this.web_url
    }
  }

  get uid() {
    return this.model.uid
  }

  get uri() {
    return `pay:?r=https://api.anypayinc.com/r/${this.model.uid}`
  }

  get web_url() {
    return `https://app.anypayinc.com/web/#/invoices/${this.model.uid}`
  }

  get currency() {
    return this.model.currency
  }

  get amount() {
    return this.model.amount
  }

  async setPaymentOptions() {

    let addresses = (await models.Address.findAll({
      where: {
        account_id: this.model.account_id
      }
    }))
    .filter(address => {
      let coin = getCoin(address.currency)
      return !coin.unavailable
    })

    this.payment_options = addresses.map(address => {

      let outputs = []

      outputs.push({
        address: address.value,
        amount: toSatoshis(this.amount)
      })

      return {
        currency: address.currency,
        invoice_uid: this.model.uid,
        uri: this.uri,
        outputs
      }
    })

    await writePaymentOptions(this.payment_options);

  }

}

export class Invoices {

  account_id: number;
  constructor(options) {
    this.account_id = options.account_id
  }

  async create(opts: CreateInvoice): Promise<Invoice> {
    if (!opts.amount) {
      throw new Error('amount required')
    }

    if (!opts.currency) {
      throw new Error('currency required')
    }

    let record = await models.Invoice.create(Object.assign({
      uid: shortid.generate(),
      account_id: this.account_id
    }, opts))

    let invoice = new Invoice(record) 

    await invoice.setPaymentOptions()

    return invoice
  }
}

