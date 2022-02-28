require('dotenv').config();

import * as Chance from 'chance';
import * as uuid from 'uuid';

const chance = new Chance();

import * as assert from 'assert';

import { registerAccount } from '../lib/accounts';

import { setAddress } from '../lib/core';

import { AccessTokenV1, ensureAccessToken } from '../lib/access_tokens'

import { Account } from '../lib/account'

export async function generateAccount() {
  return registerAccount(chance.email(), chance.word());
}

export async function createAccount(): Promise<Account> {
  let record = await registerAccount(chance.email(), chance.word());

  return new Account(record)
}

import * as bsv from 'bsv'
export async function generateKeypair() {

  let privateKey = new bsv.PrivateKey()

  let address = privateKey.toAddress()

  return {

    privateKey: privateKey.toWIF(),

    address: address.toString()

  }

}

import * as chai from 'chai'

export { chai }

const chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)

const spies = require('chai-spies');

chai.use(spies);

var spy = chai.spy.sandbox()

export { spy }

const expect = chai.expect

export {
  chance,
  assert,
  uuid,
  expect
}

import {Server} from '../servers/rest_api/server';

var server;

export { server }


function auth(username, password) {
  return `Basic ${new Buffer(username + ':' + password).toString('base64')}`;
}


export async function authRequest(account: Account, params) {

  let accessToken = await ensureAccessToken(account)

  if (!params.headers) { params['headers'] = {} }

  params.headers['Authorization'] = auth(accessToken.get('uid'), "")

  return server.inject(params)

}

before(async () => {

  server = await Server();

})
