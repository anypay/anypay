
import { models } from './models';

import { log } from './log';

import { config } from './config'

import { Invoice } from './invoices'

import { Account } from './account'

import { findOne, Orm } from './orm'

import axios from 'axios'

export const DEFAULT_WEBHOOK_URL = `${config.get('API_BASE')}/v1/api/test/webhooks`

export async function sendWebhookForInvoice(invoiceUid: string, type: string = 'default') {

  let invoice = await models.Invoice.findOne({ where: {
    uid: invoiceUid
  }});

  var started_at = new Date();
  var invoice_uid = invoice.uid;
  var url = invoice.webhook_url;
  var response_code, response_body, ended_at, error;
  var resp;

  var status = 'pending'

  if (invoice.webhook_url) {

    try {

      let json = invoice.toJSON();

      resp = await axios.post(invoice.webhook_url, json);

      response_code = resp.statusCode; 

      response_body = resp.body; 

      if (typeof resp.body !== 'string') {
        response_body = JSON.stringify(resp.body); 
      } else {
        response_body = resp.body; 
      }

      ended_at = new Date();

      status = 'success'

    } catch(e) {

      log.debug('webhook.error', e)
      log.debug('webhook.error', e.message)

      if (e.response) {

        response_code = e.response.statusCode;

        if (typeof e.response.body !== 'string') {
          response_body = JSON.stringify(e.response.text); 
        } else {
          response_body = e.response.body; 
        }

      }

      error = e.message;

      ended_at = new Date();

      status = 'failed'

    }

    let webhook = await models.Webhook.create({
      account_id: invoice.account_id,
      started_at,
      invoice_uid,
      type,
      response_code,
      response_body,
      error,
      ended_at,
      url,
      status
    })

    return webhook;

  } else {

    log.debug('invoice.webhook_url.empty', { invoice_uid: invoiceUid });

  }
}

interface FindWebhook { 
  invoice_uid: string
}

export class WebhookNotFound implements Error {
  name = 'WebhookNotFound'
  message = 'webhook not found for invoice uid'
}

export class WebhookAlreadySent implements Error {
  name = 'WebhookAlreadySent'
  message = 'webhook already sent for this invoice'
}

interface NewAttempt {
  record: any;
  webhook: Webhook;
}

export class Attempt extends Orm {

  webhook: Webhook;

  constructor(params: NewAttempt) {
    super(params.record)
    this.webhook = params.webhook
  }

  get response_code() {
    return this.get('response_code')
  }
}

interface NewWebhook {
  invoice: Invoice;
  record: any;
  attempts?: Attempt[];
}

export class Webhook extends Orm {

  static model = models.Webhook;

  attempts: Attempt[];

  invoice: Invoice;

  constructor(params: NewWebhook) {

    super(params.record)

    this.attempts = params.attempts;

    this.invoice = params.invoice;

  }

  toJSON() {

    let json = super.toJSON()

    let attempts = this.attempts.map(attempt => attempt.toJSON())

    return Object.assign(json, { attempts })

  }


  async getAccount(): Promise<Account> {

    return findOne<Account>(Account, { where: { id: this.invoice.account_id }})

  }

  get retry_policy(): string {
    return this.get('retry_policy')
  }

  get id(): number {
    return this.get('id')
  }

  get url(): string {
    return this.get('url')
  }

  get success(): boolean {
    return this.get('status') === 'success'
  }

  get status(): boolean {
    return this.get('status')
  }

  invoiceToJSON() {

    return this.invoice.toJSON()

  }

}

export async function webhookForInvoice(invoice: Invoice) {

  let record = await models.Webhook.findOne({
    where: { invoice_uid: invoice.uid }
  })

  if (!record) { throw new WebhookNotFound() }

  let attempts = await models.WebhookAttempt.findAll({

    where: { webhook_id: record.id }

  })

  return new Webhook({ record, attempts, invoice })

}

export async function findWebhook(where: FindWebhook) {

  let record = await models.Webhook.findOne({where})

  if (!record) { throw new WebhookNotFound() }

  let invoice = await models.Invoice.findOne({ where: { uid: record.invoice_uid }})

  let attempts = await models.WebhookAttempt.findAll({

    where: { webhook_id: record.id }

  })

  return new Webhook({ record, attempts, invoice })
}

export async function createWebhook(invoice: Invoice): Promise<Webhook> {

  const where = {
    invoice_uid: invoice.uid,
    url: invoice.get('webhook_url') || DEFAULT_WEBHOOK_URL,
    account_id: invoice.get('account_id')
  }

  let [webhook] = await models.Webhook.findOrCreate({
    where,
    defaults: where
  })

  if (!webhook) { throw new WebhookNotFound() }

  return new Webhook(webhook)

}

export async function attemptWebhook(webhook: Webhook): Promise<Attempt> {

  if (webhook.success) {

    throw new WebhookAlreadySent()
  }

  let record = await models.WebhookAttempt.create({
    webhook_id: webhook.id
  })

  record.start_time = new Date()

  record.started_at = new Date();

  var resp;

  let attemp = new Attempt({record, webhook})

  webhook.attempts.push(attemp)

  let json = webhook.invoiceToJSON();

  try {

    resp = await axios.post(webhook.url, json);

    record.response_code = resp.statusCode; 

    record.response_body = resp.body; 

    if (typeof resp.body !== 'string') {

      record.response_body = JSON.stringify(resp.body); 

    } else {

      record.response_body = resp.body; 
    }

    record.ended_at = new Date();

    await webhook.set('status', 'success')

  } catch(e) {

    if (e.response) {

      record.response_code = e.response.statusCode;

      if (typeof e.response.body !== 'string') {

        record.response_body = JSON.stringify(e.response.text); 

      } else {

        record.response_body = e.response.body; 

      }

    }
    record.error = e.message;

    record.ended_at = new Date();

    await record.set('status', 'failed')

  }

  await Promise.all([record.save(), webhook.save()])

  return new Attempt({record, webhook})

}

interface ListOptions {
  limit?: number;
  offset?: number;
}

export async function listForAccount(account: Account, options: ListOptions = {}): Promise<any[]> {

  let webhooks = await models.Webhook.findAll({
    where: { account_id: account.id },
    offset: options.offset,
    limit: options.limit,
    include: [{
      model: models.WebhookAttempt,
      as: 'attempts'
    }]
  })

  return webhooks

}

