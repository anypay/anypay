
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
  currency: string;
  amount: number;
  webhook_url: string;
  redirect_url: string;

  constructor(model) {
    this.model = model
    this.payment_options = []
    this.uri = `pay:?r=https://api.anypayinc.com/r/${model.uid}`
    this.currency = model.currency
    this.amount = model.amount
    this.webhook_url = model.webhook_url
    this.redirect_url = model.redirect_url
  }

  toJSON() {
    return {
      currency: this.currency,
      amount: this.amount,
      uid: this.uid,
      uri: this.uri,
      web_url: this.web_url,
      payment_options: this.payment_options.map(option => option.toJSON())
    }
  }

  get uid() {
    return this.model.uid
  }

  get web_url() {
    return `https://app.anypayinc.com/web/#/invoices/${this.model.uid}`
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

    await writePaymentOptions(this.payment_options.map(option => {
      return Object.assign(option.toJSON(), { invoice_uid: option.invoice_uid })
    }))

  }

  async loadPaymentOptions() {

    let records = await models.PaymentOption.findAll({ where: { invoice_uid: this.uid }})

    let options = []

    for (let record of records) {
      console.log('records', records)
      let option = await PaymentOption.fromRecord(this.model, record)
      options.push(option)
    }

    this.payment_options = options
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
      account_id: this.account_id,
      denomination_amount: opts.amount,
      denomination_currency: opts.currency
    }, opts))

    let invoice = new Invoice(record) 

    await invoice.setPaymentOptions()

    return invoice
  }
}

export async function find(uid: string): Promise<Invoice> {

  let record = await models.Invoice.findOne({ where: { uid }})

  if (!record) { throw new Error(`invoice ${uid} not found`) }

  let invoice = new Invoice(record)

  await invoice.loadPaymentOptions()

  return invoice

}

