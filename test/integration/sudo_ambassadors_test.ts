require('dotenv').config();

import {Server} from '../../servers/rest_api/server';
import * as assert from 'assert';

const Database = require("../../lib/database");

import * as Chance from 'chance';
const chance = new Chance();

import { v4 } from 'uuid';

import { hash } from '../../lib/password';

describe("Ambassadors API with Sudo Password", async () => {

  var server;
  
  before(async () => {
    await Database.sync();
    server = await Server();
  });

  it('GET /sudo/ambassadors should be rejected with invalid password', async () => {

    let generated = await generatePassword();

    process.env.SUDO_PASSWORD_HASH = generated.password_hash.toString();

    let response = await server.inject({

      method: 'GET',

      url: '/sudo/ambassadors',

      headers: {

        'Authorization': auth('invalid', "")

      }
    });

    assert.strictEqual(response.result.statusCode, 401);
    assert.strictEqual(response.result.error, "Unauthorized");
  
  });

  it('GET /sudo/ambassadors should be success with valid password', async () => {

    let generated = await generatePassword();

    process.env.SUDO_PASSWORD_HASH = generated.password_hash.toString();

    let response = await server.inject({

      method: 'GET',

      url: '/sudo/ambassadors',

      headers: {

        'Authorization': auth(generated.password, "")

      }

    });

    assert(response.result.ambassadors);
    
  
  });

});

async function generatePassword() {

  let password = v4();

  let password_hash = await hash(password);

  return {

    password,

    password_hash

  }

}

function auth(username, password) {

  return `Basic ${new Buffer(username + ':' + password).toString('base64')}`;
}

