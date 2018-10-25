import {generateInvoice} from '../../lib/invoice'
import {Server} from '../../servers/rest_api/server';
import * as assert from 'assert';
import {hash} from '../../lib/password';
import * as Database from '../../lib/database';

import {
  settings,
  models,
  accounts
} from "../../lib";

import * as Chance from 'chance';
const chance = new Chance();

describe("Creating Cointext invoice", async () => {
 var accessToken, account, server;
  
  before(async () => {
    await Database.sync();
    server = await Server();

    account = await accounts.registerAccount(chance.email(), chance.word());

    accessToken = await accounts.createAccessToken(account.id);

  });

  it("POST /invoices/{uid}/cointext_payments should create a cointext invoice", async () => {

    //CREATE AN INVOICE 
    let invoice = await generateInvoice(account.id, 1, 'BCH')
 
    console.log(invoice)

    try {

      let response = await server.inject({
        method: 'POST',
	url: '/invoices/${invoice.uid}/cointext_payments',
        headers: {
          'Authorization': auth(accessToken.uid, "")
        }
      });

      console.log('cointext invoice: ', responsei.result);

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
