
const WEBHOOK_URL = 'https://api.anypay.global/blockcypher/webhooks/dash';

const TOKEN = process.env.BLOCKCYPHER_TOKEN;

import * as http from 'superagent';

interface Webhook {
  id: string;
  event: string;
  address: string;
  token: string;
  url: string,
  callback_errors: number;
}

export async function createWebhook (event: string, address: string): Promise<Webhook> {

  let url = `https://api.blockcypher.com/v1/dash/main/hooks?token=${TOKEN}`;

  return http.post(url).send({

    event,

    address,

    url: WEBHOOK_URL

  });

}

export async function getWebhook (webhookId: number): Promise<Webhook> {

  let url = `https://api.blockcypher.com/v1/dash/main/hooks/${webhookId}?token=${TOKEN}`;

  return http.get(url);

}

export async function listWebhook (): Promise<Webhook[]> {

  let url = `https://api.blockcypher.com/v1/dash/main/hooks?token=${TOKEN}`;

  return http.get(url);

}

export async function deleteWebhook (webhookId: number): Promise<any> {

  let url = `https://api.blockcypher.com/v1/dash/main/hooks/${webhookId}?token=${TOKEN}`;

  return http.del(url);

}

