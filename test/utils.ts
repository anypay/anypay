require('dotenv').config();

import * as Chance from 'chance';
import * as uuid from 'uuid';

const chance = new Chance();

import * as assert from 'assert';

import { registerAccount } from '../lib/accounts';

import { setAddress } from '../lib/core';

import { AccessTokenV1, ensureAccessToken } from '../lib/access_tokens'

import { Account } from '../lib/account'

import { Address } from '../lib/addresses'

import { Invoice, createInvoice } from '../lib/invoices'

export async function generateAccount() {
  return registerAccount(chance.email(), chance.word());
}

export async function createAccount(): Promise<Account> {
  let record = await registerAccount(chance.email(), chance.word());

  return new Account(record)
}

export async function createAccountWithAddress(): Promise<[Account, Address]> {
  let record = await registerAccount(chance.email(), chance.word());

  let account = new Account(record)

  let keypair = await generateKeypair()

  let address = await  account.setAddress({ currency: 'BSV', address: keypair.address })

  return [account, address]
}

interface NewAccountInvoice {
  amount?: number;
}


export async function newAccountWithInvoice(params: NewAccountInvoice = {}): Promise<[Account, Invoice]> {

  let account = await createAccount()

  let { address } = await generateKeypair()

  await account.setAddress({ currency: 'BSV', address })

  await account.setAddress({ currency: 'BCH', address: 'qrhqkz3mavm3s58qf3znajgpghf96p7xdgtdj404hy' }) // steven bittrex
  await account.setAddress({ currency: 'DASH', address: 'XpwZpy6RH4LmkMSHNBeQds7ypSGznExQHd' })  // steven somewhere
  //await account.setAddress({ currency: 'BTC', address: '19T4miK5CUSLcYQDYSUK9T2jkLUipLhh8g' })  // steven somewhere

  let invoice = await createInvoice({
    account,
    amount: params.amount || 10
  })

  return [ account, invoice ]

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


var server, request;
export { server, request }

import {Server} from '../server/v0/server';
import * as supertest from 'supertest'

beforeEach(() => {

  spy.restore()

})

before(async () => {

  server = await Server();

  request = supertest(server.listener)

})

export async function authRequest(account: Account, params) {

  let accessToken = await ensureAccessToken(account)

  if (!params.headers) { params['headers'] = {} }

  params.headers['Authorization'] = `Bearer ${accessToken.jwt}`

  return server.inject(params)

}

export async function v0AuthRequest(account: Account, params) {

  let accessToken = await ensureAccessToken(account)

  if (!params.headers) { params['headers'] = {} }

  let token = new Buffer(accessToken.get('uid') + ':').toString('base64');

  params.headers['Authorization'] = `Basic ${token}`

  return server.inject(params)

}

export function auth(account, version=1) {

  var strategy = authRequest;

  if (version === 0) {

    strategy = v0AuthRequest

  }

  return async function(params) {

    return strategy(account, params)

  }

}

import { Wallet } from 'anypay-simple-wallet'

const WIF = process.env.ANYPAY_SIMPLE_WALLET_WIF

if (!WIF) {

  throw new Error('process.env.ANYPAY_SIMPLE_WALLET_WIF must be set before running tests.')

}

const wallet = Wallet.fromWIF(WIF)

export { wallet } 

