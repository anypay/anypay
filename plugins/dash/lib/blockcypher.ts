
/*
 * allow for staging url
 */
const webhookBase = process.env.BLOCKCYPHER_WEBHOOK_BASE || 'https://api.anypayinc.com';

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

    url: `${webhookBase}/blockcypher/webhooks/dash`

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

export function parseUnconfirmedTxEventToPayments(unconfirmedTxEvent) {
  /*
   * Example Data
   *
   * {
    "addresses": [
        "Xb5hD7dgdhrYgkLG36mkdyAxtpethNvC6d",
        "XgDW9nypEs4j57Zx5tSwPZagRukEN8HUsT",
        "XpLPkeQJq89YbiBtd2sBuBDgb12hM3xVG3"
    ],
    "block_height": -1,
    "block_index": -1,
    "confirmations": 0,
    "double_spend": false,
    "fees": 1000,
    "hash": "ad840fe3779ecf3e801bc011b230146d4a4f839ab1af1aada2600860808642fb",
    "inputs": [
        {
            "addresses": [
                "XgDW9nypEs4j57Zx5tSwPZagRukEN8HUsT"
            ],
            "age": 0,
            "output_index": 1,
            "output_value": 340972,
            "prev_hash": "deb662481a2e68ec269d05d1d83de670c6cc7e57895dca8159c9f88cb570c938",
            "script": "483045022100e64e740c75425ae9a787261b31a135980bb4279652ac866a34721bd819e6c53302206f4119b2a4dfc86a0b205162af6d1989c5df149a01ac699d0fc955ae57cd9021012103ce2b20c5c452036f7e3b2dc947b8b9af3a53426f8c3167776fd74bf58c6a83a1",
            "script_type": "pay-to-pubkey-hash",
            "sequence": 4294967295
        }
    ],
    "outputs": [
        {
            "addresses": [
                "XpLPkeQJq89YbiBtd2sBuBDgb12hM3xVG3"
            ],
            "script": "76a91495b3abf563e2e922ee9c09c1c6d3750dc05b77c588ac",
            "script_type": "pay-to-pubkey-hash",
            "value": 42000
        },
        {
            "addresses": [
                "Xb5hD7dgdhrYgkLG36mkdyAxtpethNvC6d"
            ],
            "script": "76a91404525e72f2f49c80d46fbdc8588917c50ea4241f88ac",
            "script_type": "pay-to-pubkey-hash",
            "value": 297972
        }
    ],
    "preference": "low",
    "received": "2019-01-18T03:26:33.198Z",
    "relayed_by": "35.182.63.137:9999",
    "size": 226,
    "total": 339972,
    "ver": 1,
    "vin_sz": 1,
    "vout_sz": 2
}

   */

  return unconfirmedTxEvent.outputs.map(output => {

    return {

      currency: 'DASH',

      address: output.addresses[0],

      amount: output.value / 100000000,

      confirmations: unconfirmedTxEvent.confirmations

    }

  });

}

