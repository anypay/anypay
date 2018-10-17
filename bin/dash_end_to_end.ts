#!/usr/bin/env ts-node

require('dotenv').config();

const JSONRPC = require('../plugins/bch/lib/jsonrpc');

import {exec} from 'child_process';

const rpc = new JSONRPC();

const io = require('socket.io-client');

import * as http from 'superagent';

(async function() {

  let password =  process.env.ANYPAY_PASSWORD;

  let username =  process.env.ANYPAY_USERNAME;

  if (!username || !password) {
    console.error('ANYPAY_USERNAME and ANYPAY_PASSWORD env vars must be set');
  }

  let token = await getAccessToken(username, password);

  console.log('logged in as', username);

  let invoice = await generateInvoice(token);

  let url = `https://pos.anypay.global/invoices/${invoice.uid}`;

  console.log('generated invoice', url);

  exec(`open -a "Google Chrome" ${url}`);

  const socket = io('https://ws.dash.anypay.global');

  socket.on('invoice:paid', function(data) {

    console.log("invoice paid", data);

    process.exit(0);

  });

  socket.on('connect', async function() {

    console.log('listening for payment');
    await wait(500);
    console.log('preparing payment');

    await wait(5000);

    let response = await rpc.call('sendtoaddress', [
      invoice.address,
      invoice.invoice_amount
    ]);

    console.log(`sent payment of ${invoice.invoice_amount} DASH to ${invoice.address}`);

  });

  socket.emit("subscribe", {invoice: invoice.uid});

})();

async function getAccessToken(email, password): Promise<any> {

    let response = await http
      .post('https://api.anypay.global/access_tokens')
      .auth(email, password);

    return response.body.uid;

}

async function generateInvoice(token: string): Promise<any> {

    let response = await http
      .post('https://api.anypay.global/dash/invoices')
      .auth(token, '')
      .send({
        currency: "DASH",
        amount: 0.10
      });

    return response.body;
}

function auth(username, password) {
  return `Basic ${new Buffer(username + ':' + password).toString('base64')}`;
}

function wait(ms) {

  return new Promise(resolve => {

    setTimeout(resolve, ms);
  });

}
