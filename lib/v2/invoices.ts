
import * as shortid from 'shortid'
import { getCoin } from '../coins'

import { models } from '../models'

import { toSatoshis } from '../pay'
import { writePaymentOptions } from '../payment_options'
import { createAddressRoute } from '../routes'
import { PaymentOption } from './payment_options'

interface CreateInvoice {
  currency: string;
  amount: number;
  uid?: string;
}
export class Invoice {
  model: any;
  payment_options: PaymentOption[];
  uri: string;

  constructor(model) {
    this.model = model
    this.payment_options = []
    this.uri = `pay:?r=https://api.anypayinc.com/r/${model.uid}`
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


    for (let address of addresses) {

      let option = new PaymentOption(this.model, address)

      await option.setMerchantOutput()
      await option.setAffiliateOutput()
      await option.setPlatformFeeOutput()

      this.payment_options.push(option)

    }

    await writePaymentOptions(this.payment_options.map(option => option.toJSON()))

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

