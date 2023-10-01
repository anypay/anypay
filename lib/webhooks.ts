

import { log } from './log';

import { config } from './config'

import { Invoice } from './invoices'

import { Account } from './account'

import { WebhookAttempts, Webhooks, invoices } from '@prisma/client';
import { prisma } from './prisma';
import { AxiosResponse } from 'axios';

export const DEFAULT_WEBHOOK_URL = `${config.get('API_BASE')}/v1/api/test/webhooks`

/**
 * Asynchronously sends a webhook and updates its status in the database.
 *
 * @param webhook - The webhook to send.
 * @returns The updated webhook.
 */
export async function sendWebhook(webhook: Webhooks): Promise<Webhooks> {

  if (webhook.url) {
    try {
      // Make the request using the postDataWithAxios function
      const { responseCode, responseBody } = await postDataWithAxios({ url: webhook.url, payload: webhook.payload });

      // Using Prisma, update the webhook record
      await prisma.webhooks.update({
        where: {
          id: webhook.id
        },
        data: {
          response_body: responseBody,
          status: 'success',
          ended_at: new Date(),
          response_code: responseCode
        }
      });

      // Convert the webhook Prisma record to JSON
      const event = (webhook as any).toJSON();

      delete event.account_id;
      delete event.invoice_uid;

      log.info('webhook.sent', event);

    } catch (e) {

      log.debug('webhook.error', e);
      log.debug('webhook.error', e.message);

      let response_code: number | undefined, response_body: string | undefined;

      if (e.response) {
        response_code = e.response.status;
        response_body = typeof e.response.data !== 'string' ? JSON.stringify(e.response.data) : e.response.data;
      }

      // Using Prisma, update the webhook record
      await prisma.webhooks.update({
        where: {
          id: webhook.id
        },
        data: {
          response_body,
          status: 'failed',
          ended_at: new Date(),
          response_code,
          error: e.message,
        }
      });

      log.info('webhook.failed', webhook);
    }

    return webhook;
  }

  throw new Error("Webhook URL is not defined.");
}

/**
 * Async function to post data to a given URL and process the response.
 * 
 * @param webhook - An object containing `url` and `payload`.
 * @returns An object containing `responseCode` and `responseBody`.
 */
async function postDataWithAxios(webhook: { url: string, payload: any }): Promise<{ responseCode: number, responseBody: string }> {
  let response: AxiosResponse<any>;

  try {
    // Perform the POST request using Axios
    response = await axios.post(webhook.url, webhook.payload);
  } catch (error) {
    // Handle error accordingly
    console.error('Axios post failed:', error);
    throw error;
  }

  // Extract the status code and data body from the response
  const { status: responseCode, data: responseBodyData } = response;

  // Convert the response body to string if it's not already
  let responseBody: string;
  if (typeof responseBodyData !== 'string') {
    responseBody = JSON.stringify(responseBodyData);
  } else {
    responseBody = responseBodyData;
  }

  return { responseCode, responseBody };
}



export async function sendWebhookForInvoice(invoiceUid: string, type: string = 'default') {

  // find id using prisma 

  const invoice = await prisma.invoices.findFirst({
    where: {
      uid: invoiceUid
    }
  })

  // find or create webhook using prisma
  const webhook = await prisma.webhooks.upsert({
    where: {
      id: invoice.id
    },
    update: {
      payload: invoice
    },
    create: {
      account_id: invoice.account_id,
      invoice_uid: invoice.uid,
      type,
      url: invoice.webhook_url,
      status: 'pending',
      payload: invoice,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })


  if (JSON.stringify(webhook.payload) == '{}') {

    // update webhook using prisma
    await prisma.webhooks.update({
      where: {
        id: webhook.id
      },
      data: {
        payload: invoice
      }
    })

    // explain in comments how prisma implicitly converts a record to json please
    // https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/implicit-conversion-of-records-to-json

    log.info('webhook.emptyPayload.updated', webhook)

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
  webhook: Webhooks;
}

export async function webhookForInvoice(invoice: Invoice): Promise<Webhooks> {

  const webhook = await prisma.webhooks.findFirstOrThrow({
    where: {
      invoice_uid: invoice.uid
    }
  })

  return webhook
}

export async function findWebhook(where: FindWebhook) {

  const webhook = await prisma.webhooks.findFirstOrThrow({
    where
  })

  return webhook
}

export async function createWebhookForInvoice(invoice: invoices): Promise<Webhooks> {

  const where = {
    invoice_uid: invoice.uid,
    url: invoice.webhook_url || DEFAULT_WEBHOOK_URL,
    account_id: invoice.account_id
  }

  return prisma.webhooks.upsert({
    where: {
      invoice_uid: invoice.uid
    },
    update: {
      payload: invoice
    },
    create: {
      ...where,
      payload: invoice,
      type: 'default',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })


}

interface InterfaceJSON {

}

export async function attemptWebhook(webhook: Webhooks): Promise<WebhookAttempts> {

  const attempt = await prisma.webhookAttempts.create({
    data: {
      webhook_id: webhook.id,
      started_at: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  let json = webhook.invoiceToJSON();

  try {

    const updates: any = {}

    let resp = await axios.post(webhook.url, json);

    updates.response_code = resp.statusCode; 

    updates.response_body = resp.body; 

    if (typeof resp.body !== 'string') {

      updates.response_body = JSON.stringify(resp.body); 

    } else {

      updates.response_body = resp.body; 
    }

    updates.ended_at = new Date();

    await prisma.webhooks.update({
      where: {
        id: webhook.id
      },
      data: updates
    })


  } catch(e) {

    if (e.response) {

      await prisma.webhookAttempts.update({
        where: {
          id: attempt.id
        },
        data: {
          response_code: e.response.statusCode,
          response_body: e.response.text,
          ended_at: new Date()
        }
      })

    }
    await prisma.webhookAttempts.update({
      where: {
        id: attempt.id
      },
      data: {
        response_code: attempt.response_code,
        response_body: attempt.response_body,
        ended_at: new Date()
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

/**
 * Asynchronously lists webhooks for a given account.
 *
 * @param account - The account for which to list webhooks.
 * @param options - Pagination options, which can include offset and limit.
 * @returns A Promise resolving to an array of webhooks for the account.
 */
export async function listForAccount(account: Account, options: ListOptions = {}): Promise<any[]> {
  const webhooks = await prisma.webhooks.findMany({
    where: { account_id: account.id },
    skip: options.offset,
    take: options.limit,
  });

  return webhooks;
}

