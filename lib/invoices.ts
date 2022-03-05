
const validator = require('validator')

import { createWebhook } from './webhooks'

import { Account, findAccount } from './account'

import { PaymentOption } from './payment_option'

import { computeInvoiceURI } from './uri'

import { models } from './models'

import { Orm } from './orm'

import { v4 } from 'uuid'

import { createPaymentOptions } from './invoice'

export class InvoiceNotFound implements Error {
  name = 'InvoiceNotFound'
  message = 'Invoice Not Found'
}

export async function ensureInvoice(uid: string) {

  let record = await models.Invoice.findOne({
    where: { uid }
  })


  if (!record) { throw new InvoiceNotFound() }

  return new Invoice(record)

}
export async function getInvoice(uid: string) {

  let record = await models.Invoice.findOne({
    where: { uid }
  })

  if (!record) { return }

  return new Invoice(record)

}

interface NewInvoice {

  account: Account;

  amount: number;

  webhook_url?: string;

  external_url?: string;

}

export class InvalidWebhookURL implements Error {

  name = 'InvalidWebhookURL'

  message = 'webhook_url parameter must be a valid HTTPS URL'

  constructor(invalidURL: string) {

    this.message = `${this.message}: received ${invalidURL}`
  }
}

export class Invoice extends Orm{

  get account_id(): any {

    return this.get('account_id')
  }

  get denomination(): string {

    return this.get('denomination_currency')

  }

  get uid(): string {

    return this.get('uid')
  }

  get webhook_url(): string {

    return this.get('webhook_url')

  }

  toJSON() {

    let json = super.toJSON()

    Object.keys(json).forEach(key => {
      if (json[key] === undefined) {
        delete json[key];
      }

      if (json[key] === null) {
        delete json[key];
      }

      if (json[key] === NaN) {
        delete json[key];
      }
    });

    delete json.currency
    delete json.cancelled
    delete json.locked
    delete json.replace_by_fee
    delete json.denomination_amount
    delete json.denomination_currency
    delete json.account_id
    delete json.id
    delete json.complete
    delete json.headers
    delete json.currency_specified
    delete json.currency_specified
    delete json.updatedAt

    return json

  }

  async getAccount(): Promise<Account> {

    let record = await models.Account.findOne({
      where: { id: this.get('account_id') }
    })

    return new Account(record)

  }


  async getPaymentOptions(): Promise<PaymentOption[]> {

    let records = await models.PaymentOption.findAll({
      where: { invoice_uid: this.get('uid') }
    })

    return records.map(record => new PaymentOption(this, record))

  }

}

export async function createInvoice(params: NewInvoice): Promise<Invoice> {


  const uid = v4();

  var newInvoice: any = {

    denomination_currency: params.account.denomination,

    denomination_amount: params.amount,

    currency: params.account.denomination,

    amount: params.amount,

    account_id: params.account.id,

    status: 'unpaid',

    uid,

    uri: computeInvoiceURI({

      currency: 'ANYPAY',

      uid

    })

  }

  if (params.webhook_url) {

    if (validator.isURL(params.webhook_url, {protocols: 'https'})) {

      newInvoice['webhook_url'] = params.webhook_url

    } else {

      throw new InvalidWebhookURL(params.webhook_url)

    }
  }

  var record = await models.Invoice.create(newInvoice);

  const account = await findAccount(record.account_id)

  var webhook_url = params.webhook_url

  if (!webhook_url) {

    webhook_url = account.get('webhook_url')

  }

  if (webhook_url) {

    await createWebhook({

      invoice_uid: uid,

      url: webhook_url,

      account_id: record.account_id

    })
  }

  await createPaymentOptions(account.record, record)

  return new Invoice(record)

}

