const http = require("superagent");

const token = process.env.BLOCKCYPHER_TOKEN;
const webhookUrl = process.env.BLOCKCYPHER_WEBHOOK_URL ||
  'https://blockcypher.anypay.global/dash-blockcypher-webhooks'

if (!token) {
  throw new Error('BLOCKCYPHER_TOKEN environment variable required');
}

module.exports.createWebhook = function createWebhook(address) {

  return new Promise((resolve, reject) => {
    let webhook = {
      event: "unconfirmed-tx",
      address: address,
      url: webhookUrl
    };

    http
      .post(`https://api.blockcypher.com/v1/dash/main/hooks?token=${token}`)
      .send(webhook)
      .end((error, response) => {
        if (error) {
          return reject(error);
        }
        resolve(response.body.id);
      });
  });
}

module.exports.deleteWebhook = function deleteWebhook(webhookId) {

  return new Promise((resolve, reject) => {
    http
      .del(`https://api.blockcypher.com/v1/dash/main/hooks/${webhookId}?token=${token}`)
      .end((error, response) => {
        if (error) {
          return reject(error);
        }
        resolve(response.body);
      });
  });
}

