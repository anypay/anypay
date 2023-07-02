
import { models } from './models';

import { log } from './log';

import { config } from './config'

import { Invoice } from './invoices'

import { Account, findAccount } from './account'

import { Orm, findOrCreate } from './orm'

import * as http from 'superagent';

export const DEFAULT_WEBHOOK_URL = `${config.get('API_BASE')}/v1/api/test/webhooks`

export async function sendWebhook(webhook: Webhook) {

  if (webhook.url) {

    try {

      let resp = await http.post(webhook.url).send(webhook.payload);

      let response_code = resp.statusCode; 

      let response_body = resp.body; 

      if (typeof resp.body !== 'string') {
        response_body = JSON.stringify(resp.body); 
      } else {
        response_body = resp.body; 
      }

      await webhook.update({
        response_body,
        status: 'success',
        ended_at: new Date(),
        response_code
      })

      const event = webhook.toJSON()

      delete event.account_id
      delete event.invoice_uid

      log.info('webhook.sent', event)

    } catch(e) {

      log.debug('webhook.error', e)
      log.debug('webhook.error', e.message)

      var response_code, response_body;

      if (e.response) {

        response_code = e.response.statusCode;

        if (typeof e.response.body !== 'string') {
          response_body = JSON.stringify(e.response.text); 
        } else {
          response_body = e.response.body; 
        }

      }

      await webhook.update({
        'status': 'failed',
        error: e.message,
        ended_at: new Date(),
        response_body,
        response_code
      })

      const event = webhook.toJSON()

      delete event.account_id
      delete event.invoice_uid

      log.info('webhook.failed', webhook)

    }

    return webhook;

  }
}


export async function sendWebhookForInvoice(invoiceUid: string, type: string = 'default') {

  let invoice = await models.Invoice.findOne({ where: {
    uid: invoiceUid
  }});;

  const payload = invoice.toJSON();

  let [webhook] = await findOrCreate<Webhook>(Webhook, {
    where: {
      invoice_uid: invoice.uid
    },
    defaults: {
      account_id: invoice.account_id,
      invoice_uid: invoice.uid,
      type,
      url: invoice.webhook_url,
      status: 'pending',
      payload
    }
  })

  if (JSON.stringify(webhook.payload) == '{}') {

    await webhook.update({
      payload: invoice.toJSON()
    })

    log.info('webhook.emptyPayload.updated', webhook.toJSON())

  }

  return sendWebhook(webhook)
}

interface FindWebhook { 
  invoice_uid: string
}

class WebhookNotFound implements Error {
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

export class Webhook extends Orm {

  static model = models.Webhook;

  attempts: Attempt[];

  invoice: Invoice;

  constructor(record) {
    super(record)

    this.attempts = []
  }

  toJSON() {

    let json = super.toJSON()

    let attempts = this.attempts.map(attempt => attempt.toJSON())

    return Object.assign(json, { attempts })

  }


  async getAccount(): Promise<Account> {

    return findAccount(this.invoice.account_id)

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

  get payload(): string {
    return this.get('payload')
  }

  get success(): boolean {
    return this.get('status') === 'success'
  }

  get status(): boolean {
    return this.get('status')
  }

  setAttempts(attempts: Attempt[]) {
    this.attempts = attempts
  }

  setInvoice(invoice: Invoice) {
    this.invoice = invoice
  }

  invoiceToJSON() {

    return this.invoice.toJSON()

  }

}

export async function webhookForInvoice(invoice: Invoice): Promise<Webhook> {

  let record = await models.Webhook.findOne({
    where: { invoice_uid: invoice.uid }
  })

  if (!record) { throw new WebhookNotFound() }

  let attempts = await models.WebhookAttempt.findAll({

    where: { webhook_id: record.id }

  })

  const webhook = new Webhook(record)

  webhook.setInvoice(invoice)
  webhook.setAttempts(attempts.map(attempt => new Attempt({record: attempt, webhook})))

  return webhook
}

export async function findWebhook(where: FindWebhook) {

  let record = await models.Webhook.findOne({where})

  if (!record) { throw new WebhookNotFound() }

  let invoice = await models.Invoice.findOne({ where: { uid: record.invoice_uid }})

  let attempts = await models.WebhookAttempt.findAll({

    where: { webhook_id: record.id }

  })

  const webhook = new Webhook(record)

  webhook.setInvoice(new Invoice(invoice))
  webhook.setAttempts(attempts.map(attempt => new Attempt({record: attempt, webhook})))

  return webhook
}

export async function createWebhookForInvoice(invoice: Invoice): Promise<Webhook> {

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

export class WebhookFailed implements Error {
  name = 'WebhookFailed'
  message = 'webhook failed'
  attempt: Attempt;

  constructor(attempt: Attempt) {
    this.attempt = attempt
  }
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

    resp = await http.post(webhook.url).send(json);

    record.response_code = resp.statusCode; 

    record.response_body = resp.body; 

    if (typeof resp.body !== 'string') {

      console.log('RESP 1', resp.body)

      record.response_body = JSON.stringify(resp.body); 

    } else {
      console.log('RESP 2', resp.body)

      record.response_body = resp.body; 
    }

    record.ended_at = new Date();

    await webhook.set('status', 'success')

  } catch(e) {

    if (e.response) {

      record.response_code = e.response.statusCode;

      record.response_body = e.response.text

    }
    record.error = e.message;

    record.ended_at = new Date();

    record.status = 'failed'

    record.ended_at = new Date()

  }

  await Promise.all([record.save(), webhook.save()])

  return new Attempt({record, webhook})

}

export interface ApiClient {
  identifier: string;
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

