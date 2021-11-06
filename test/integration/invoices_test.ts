import { Server } from '../../servers/rest_api/server';
import * as assert from 'assert';
import {hash} from '../../lib/password';
import { setAddress, setDenomination } from '../../lib/core';

import { models, database, invoices } from '../../lib';

import * as Chance from 'chance';
const chance = new Chance();

describe("Creating Invoices via REST", async () => {
  var account, accessToken, server;
  
  before(async () => {

    server = await Server();

    try {
      account = await models.Account.create({
        email: chance.email(),
        password_hash: await hash(chance.word())
      })

      accessToken = await models.AccessToken.create({
        account_id: account.id
      })

    } catch(error) {
      console.error('ERROR', error.message);
    }
  });

});

function auth(username, password) {
  return `Basic ${new Buffer(username + ':' + password).toString('base64')}`;
}

