#!/usr/bin/env node

const http = require('superagent');

const invoice = process.argv[2];
const token = process.env.BLOCKCYPHER_TOKEN;

function getWebhooks(callback) {
  http
    .get(`https://api.blockcypher.com/v1/dash/main/hooks/?token=${token}`)
    .end((error, response) => {
      callback(response.body);
    });
}

function deleteWebhook(id) {
  return new Promise((resolve, reject) => {
    http
      .delete(`https://api.blockcypher.com/v1/dash/main/hooks/${id}?token=${token}`)
      .end((error, response) => {
        resolve();
      });
  });
}

getWebhooks(webhooks => {

  Promise.all(webhooks.map(webhook => {
    return deleteWebhook(webhook.id);
  }))
  .then(() => console.log("done"));
});
