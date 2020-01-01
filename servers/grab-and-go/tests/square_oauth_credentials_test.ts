require('dotenv').config();

import {Server} from '../server';
import * as assert from 'assert';

import * as uuid from 'uuid';

import {setAddress} from '../../../lib/core';

import { models, database, accounts, prices } from "../../../lib";

import * as Chance from 'chance';
const chance = new Chance();

describe("Posting Square Oauth Credentials", async () => {
 var account, server;
  
  before(async () => {

    try {
      await database.sync();
      server = await Server();

      await prices.setPrice('BCH', 0.05, 'static', 'USD');

      account = await accounts.registerAccount(chance.email(), chance.word());

      await setAddress({
        account_id: account.id,
        currency: 'BCH',
        address: 'bitcoincash:qqdg7dyhx5ulan73pr2dvm03upatussskyseckns7e'
      }); 
    } catch(error) {

      console.log('error', error.message);
    }
  
  });

  it("POST /grab-and-go/square-oauth-callback should persist the square code", async () => {
    console.log('in the test');
 
    try {

      let accessToken = await models.AccessToken.create({
        account_id: account.id
      })

      let response = await server.inject({
        method: 'POST',
        url: `/grab-and-go/square/oauth/codes`,
        payload: {
          code: uuid.v4()
        },
        headers: {
          'Authorization': auth(accessToken.uid, "")
        }
      });

      console.log(response.result);

    } catch(error) {

      console.error('ERROR', error.message);
      throw error;

    }
  });

});


function auth(username, password) {
  return `Basic ${new Buffer(username + ':' + password).toString('base64')}`;
}
