/*
    This file is part of anypay: https://github.com/anypay/anypay
    Copyright (c) 2017 Anypay Inc, Steven Zeiler

    Permission to use, copy, modify, and/or distribute this software for any
    purpose  with  or without fee is hereby granted, provided that the above
    copyright notice and this permission notice appear in all copies.

    THE  SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
    WITH  REGARD  TO  THIS  SOFTWARE  INCLUDING  ALL  IMPLIED  WARRANTIES  OF
    MERCHANTABILITY  AND  FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
    ANY  SPECIAL ,  DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
    WHATSOEVER  RESULTING  FROM  LOSS  OF USE, DATA OR PROFITS, WHETHER IN AN
    ACTION  OF  CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
    OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
//==============================================================================
import { log } from './log';

import { config } from './config'

import {
  invoices as Invoice,
  accounts as Account
} from '@prisma/client'

import axios from 'axios'

import {
  Webhooks as Webhook,
  WebhookAttempts as WebhookAttempt,
} from '@prisma/client'

import prisma from './prisma';

import { z } from 'zod'

import { publish as publishAmqp } from './amqp'


import InvoicePaidEvent from '../src/webhooks/schemas/InvoicePaidEvent'
import InvoiceCreatedEvent from '../src/webhooks/schemas/InvoiceCreatedEvent';
import InvoiceCancelledEvent from '../src/webhooks/schemas/InvoiceCancelledEvent';
import PaymentConfirmingEvent from '../src/webhooks/schemas/PaymentConfirmingEvent';
import PaymentConfirmedEvent from '../src/webhooks/schemas/PaymentConfirmedEvent';
import PaymentFailedEvent from '../src/webhooks/schemas/PaymentFailedEvent'

const webhookSchemas: {
  [topic: string]: z.ZodObject<any>
} = {
  'invoice.created': InvoiceCreatedEvent,
  'invoice.cancelled': InvoiceCancelledEvent,
  'invoice.paid': InvoicePaidEvent,
  'payment.confirming': PaymentConfirmingEvent,
  'payment.confirmed': PaymentConfirmedEvent,
  'payment.failed': PaymentFailedEvent
}

export function validate({ topic, payload }: { topic: string, payload: any }): boolean {

  console.log('webhook.validate', { topic, payload })

  try {

    const schema = webhookSchemas[topic]

    console.log('schema', schema)

    if (!schema) {
      return false
    }

    // throws error for invalid schema
    schema.parse({ topic, payload })

    return true

  } catch(error) {

    console.error(error)

    return false

  }

}

export async function publish<T>({ topic, payload }: {topic: string, payload: T}) {

  log.info('webhook.publish', { topic, payload })

  publishAmqp(topic, {topic, payload})

}

export type WebhookTopic = 'invoice.created' | 'invoice.cancelled' | 'invoice.paid' | 'payment.confirming' | 'payment.confirmed' | 'payment.failed'

export async function createAndSendWebhook(topic: WebhookTopic, payload: any) {

  const schema = webhookSchemas[topic]

  if (!schema) {
    throw new Error('invalid webhook type')
  }

  const validated = schema.parse(payload) as z.infer<typeof schema>

  const appWebhooks = await prisma.appWebhooks.findMany({
    where: {
      app_id: validated.app_id,
      topics: {
        has: topic    
      }
    }
  })

  const accountWebhooks = await prisma.accountWebhooks.findMany({
    where: {
      account_id: validated.account_id
    }
  })

  for (let appWebhook of appWebhooks) {

    const webhook = await prisma.webhooks.create({
      data: {
        app_id: Number(appWebhook.app_id),
        url: appWebhook.url,
        type: topic,
        payload: validated,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
  
    sendWebhook(webhook)
  }

  for (let accountWebhook of accountWebhooks) {

    const webhook = await prisma.webhooks.create({
      data: {
        account_id: Number(accountWebhook.account_id),
        url: accountWebhook.url,
        type: topic,
        payload: validated,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
  
    sendWebhook(webhook)
  }


}

export const DEFAULT_WEBHOOK_URL = `${config.get('API_BASE')}/v1/api/test/webhooks`

export async function sendWebhook(webhook: Webhook) {

  if (webhook.url) {

    try {

      let resp = await axios.post(webhook.url, webhook.payload)

      let response_code = resp.status; 

      let response_body = resp.data; 

      if (typeof resp.data !== 'string') {
        response_body = JSON.stringify(resp.data); 
      } else {
        response_body = resp.data; 
      }

      await prisma.webhooks.update({
        where: { id: webhook.id },
        data: {
          response_body,
          status: 'success',
          ended_at: new Date(),
          response_code
        }
      })

      const event = Object.create({...webhook})

      delete event.account_id
      delete event.invoice_uid

      log.info('webhook.sent', event)

    } catch(e: any) {

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

      await prisma.webhooks.update({
        where: { id: webhook.id },
        data: {
          status: 'failed',
          error: e.message,
          ended_at: new Date(),
          response_body,
          response_code
        }
      })

      const event = Object.create({...webhook })

      delete event.account_id
      delete event.invoice_uid

    
      log.info('webhook.failed', event)

    }

    return webhook;

  }
}


export async function sendWebhookForInvoice(invoiceUid: string, type: string = 'default') {

  const invoice = await prisma.invoices.findFirstOrThrow({
    where: {
      uid: invoiceUid
    }
  })

  const payload = JSON.parse(JSON.stringify(invoice))

  let webhook = await prisma.webhooks.findFirst({
    where: { invoice_uid: invoice.uid }
  })

  if (!webhook) {

    webhook = await prisma.webhooks.create({
      data: {
        account_id: invoice.account_id,
        invoice_uid: invoice.uid,
        url: invoice.webhook_url,
        type,
        status: 'pending',
        payload,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

  }

  if (JSON.stringify(webhook.payload) == '{}') {

    webhook = await prisma.webhooks.update({
      where: { id: webhook.id },
      data: {
        payload
      }
    
    })


    log.info('webhook.emptyPayload.updated', webhook)

  }

  return sendWebhook(webhook)
}

interface FindWebhook { 
  invoice_uid: string
}

export class WebhookAlreadySent implements Error {
  name = 'WebhookAlreadySent'
  message = 'webhook already sent for this invoice'
}

export async function webhookForInvoice(invoice: Invoice): Promise<Webhook> {

  return prisma.webhooks.findFirstOrThrow({
    where: {
      invoice_uid: invoice.uid
    }
  })

}

export async function findWebhook(where: FindWebhook): Promise<Webhook> {

  const webhook = await prisma.webhooks.findFirstOrThrow({
    where
  })

  return webhook
}

export async function createWebhookForInvoice(invoice: Invoice): Promise<Webhook> {

  let webhook = await prisma.webhooks.findFirst({
    where: {
      invoice_uid: invoice.uid
    }
  })

  if (!webhook) {

    webhook = await prisma.webhooks.create({
      data: {
        invoice_uid: invoice.uid,
        url: invoice.webhook_url || DEFAULT_WEBHOOK_URL,
        account_id: invoice.account_id,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
  }
  return webhook
}

export async function attemptWebhook(webhook: Webhook): Promise<WebhookAttempt> {

  if (webhook.status === 'success') {

    throw new WebhookAlreadySent()
  }

  var attempt = await prisma.webhookAttempts.create({
    data: {
      webhook_id: webhook.id,
      started_at: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  const invoice = await prisma.invoices.findFirstOrThrow({
    where: { uid: webhook.invoice_uid }
  })

  let json = JSON.parse(JSON.stringify(invoice))

  try {

    const resp = await axios.post(String(webhook.url), json);

    const response_code = resp.status;
    const response_body = typeof resp.data !== 'string' ? JSON.stringify(resp.data) : resp.data;
    const ended_at = new Date();

    attempt = await prisma.webhookAttempts.update({
      where: { id: attempt.id },
      data: {
        response_code,
        response_body,
        ended_at,
        updatedAt: new Date(),

      }
    })

    await prisma.webhooks.update({
      where: { id: webhook.id },
      data: {
        status: 'success',
        ended_at: new Date()
      }
    })

  } catch(e: any) {

    var response_code, response_body;


    if (e.response) {

      response_code = e.response.statusCode;

      response_body = e.response.text

    }

    await prisma.webhookAttempts.update({
      where: { id: attempt.id },
      data: {
        error: e.message,
        ended_at: new Date(),
        updatedAt: new Date(),
        response_body,
        response_code
      }
    })

  }

  return attempt

}

export interface ApiClient {
  identifier: string;
}

interface ListOptions {
  limit?: number;
  offset?: number;
}

export async function listForAccount(account: Account, options: ListOptions = {}): Promise<Webhook[]> {

  const webhooks = await prisma.webhooks.findMany({
    where: {
      account_id: account.id
    },
    take: options.limit,
    skip: options.offset
  })

  return webhooks

}

