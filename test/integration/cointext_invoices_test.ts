require('dotenv').config();

import {Server} from '../../servers/rest_api/server';
import * as assert from 'assert';
import {hash} from '../../lib/password';

import {setAddress} from '../../lib/core';

import { settings, database, invoices, models, accounts } from "../../lib";

import * as Chance from 'chance';
const chance = new Chance();

describe("Creating Cointext invoice", async () => {
 var accessToken, account, server;
  
  before(async () => {
    await database.sync();
    server = await Server();

    account = await accounts.registerAccount(chance.email(), chance.word());

    await setAddress({
      account_id: account.id,
      currency: 'BCH',
      address: 'bitcoincash:qqdg7dyhx5ulan73pr2dvm03upatussskyseckns7e'
    }); 

    accessToken = await accounts.createAccessToken(account.id);

  });

  it.skip("POST /invoices/{uid}/cointext_payments should create a cointext invoice", async () => {

    //CREATE AN INVOICE 
    let invoice = await invoices.generateInvoice(account.id, 1, 'BCH')

    console.log('invoice GENERATED', invoice.toJSON());
 
    try {

      let response = await server.inject({
        method: 'POST',
        url: `/invoices/${invoice.uid}/cointext_payments`,
      });

      console.log('cointext invoice: ', response.result);

      // assert(response.result.coins);

    } catch(error) {

      console.error('ERROR', error.message);
      throw error;
      }
    });

 });
function auth(username, password) {
  return `Basic ${new Buffer(username + ':' + password).toString('base64')}`;
}
