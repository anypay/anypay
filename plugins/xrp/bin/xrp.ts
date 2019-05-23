#!/usr/bin/env ts-node 
require('dotenv').config();

import * as program from 'commander';

import { parsePaymentFromTransaction, rippleLib_checkAddressForPayments } from '../lib/ripple_restAPI';

import { models } from '../../../lib';

import { awaitChannel } from '../../../lib/amqp';

import { validateAddress } from '../';

import * as WebSocket from 'ws';

export class WebsocketSubscriptionManager {

  subscriptions: string[] = [];

  ws: WebSocket;

  subscribeAll() {

    let message = {
      "id": "anypay.watchall",
      "command": "subscribe",
      "accounts": this.subscriptions
    };

    console.log('message', message);

    this.ws.send(new Buffer(JSON.stringify(message)));

  }

  start() {
    
    // set fresh websocket and re-subscribe to all subscriptions
    this.ws = new WebSocket('wss://s1.ripple.com');

    this.ws.on('open', () => {

      this.subscribeAll(); 

      this.ws.on('message', (data) => {

        let message = JSON.parse(data.toString());

        if (message.engine_result === 'tesSUCCESS') {

          if (message.transaction.TransactionType === 'Payment') {

            try {

              let payment = parsePaymentFromTransaction(message.transaction);

              this.onPayment(payment);

            } catch(error) {

              console.error(error.message);

            }

          }

        }

      });

    });

  }

  onPayment(message) {

    console.log("onPayment", message);

  }

  addAccount(account) {

    this.subscriptions.push(account);

  }

}

function subscribe(ws, address) {


}

program
  .command('checkaddressforpayment <address> [tag]')
  .action(async (address, tag) => {

    let channel = await awaitChannel();

    let resp = await rippleLib_checkAddressForPayments(address, tag);

    console.log("resp", resp);

    let message = new Buffer(JSON.stringify(resp));

    channel.publish('anypay.payments', 'payment', message);

    console.log(resp);

  });

program
  .command('subscribe <account>')
  .action(async (account) => {
  const WebSocket = require('ws');

    let subscriptionManager = new WebsocketSubscriptionManager();

    subscriptionManager.addAccount(account);

    subscriptionManager.start();

  });

program
  .command('subscribeall')
  .action(async (account) => {

    let subscriptionManager = new WebsocketSubscriptionManager();

    let addresses = await models.Address.findAll({ where: { currency: "XRP" }});

    addresses.forEach(address => {

      if (validateAddress(address.value)) {

        subscriptionManager.addAccount(address.value);

      }

    });

    subscriptionManager.start();

  });

program.parse(process.argv);

