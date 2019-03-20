#!/usr/bin/env ts-node

import * as  http from "superagent";

const token = process.env.BLOCKCYPHER_TOKEN;

async function getWebhooks() {
  let resp = await http
    .get(`https://api.blockcypher.com/v1/dash/main/payments/?token=${token}`)

  return resp.body;
}

async function deleteWebhook(id) {
  await http
    .delete(
      `https://api.blockcypher.com/v1/dash/main/forwards/${id}?token=${token}`
    )
}

async function deletePayment(id) {
  await http
    .delete(
      `https://api.blockcypher.com/v1/dash/main/payments/${id}?token=${token}`
    )
}

(async function() {

  let webhooks = await getWebhooks();

  console.log(webhooks);

  for (let i=0; i < webhooks.length; i++) {
      let webhook = webhooks[i];

      console.log('delete webhook', webhook);
      //let resp = await deleteWebhook(webhook.id);
      let resp = await deletePayment(webhook.id);
      console.log(resp);

  }


})();
