require('dotenv').config();

import * as Chance from 'chance';

import * as uuid from 'uuid';

const chance = new Chance();

import * as assert from 'assert';

import { registerAccount } from '../lib/accounts';

import { ensureAccessToken } from '../lib/access_tokens'

import { Account } from '../lib/account'

import { Address } from '../lib/addresses'

import { Invoice, createInvoice } from '../lib/invoices'

import { findOrCreateWalletBot, WalletBot } from '../apps/wallet-bot';

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

interface NewInvoice {
  amount?: number;
  account?: Account;
}

export async function createAccountWithAddresses(): Promise<Account> {

  let record = await registerAccount(chance.email(), chance.word());

  let account = new Account(record)

  let { address } = await generateKeypair()

  await account.setAddress({ currency: 'BSV', address })

  let { address: bch_address } = await generateKeypair('BCH')

  await account.setAddress({ currency: 'BCH', address: bch_address })

  let { address: dash_address } = await generateKeypair('DASH')
  
  await account.setAddress({ currency: 'DASH', address: dash_address })

  return account
}

export async function setAddresses(account: Account): Promise<Account> {

  let { address } = await generateKeypair()

  console.log(account)

  await account.setAddress({ currency: 'BSV', address })

  let { address: bch_address } = await generateKeypair('BCH')

  await account.setAddress({ currency: 'BCH', address: bch_address })

  let { address: dash_address } = await generateKeypair('DASH')
  
  await account.setAddress({ currency: 'DASH', address: dash_address })

  return account
}

export async function newAccountWithInvoice(params: NewAccountInvoice = {}): Promise<[Account, Invoice]> {

  let account = await createAccount()

  let { address } = await generateKeypair()

  await account.setAddress({ currency: 'BSV', address })

  let { address: bch_address } = await generateKeypair('BCH')

  await account.setAddress({ currency: 'BCH', address: bch_address })

  let { address: dash_address } = await generateKeypair('DASH')
  
  await account.setAddress({ currency: 'DASH', address: dash_address })

  let invoice = await createInvoice({
    account,
    amount: params.amount || 10
  })

  return [ account, invoice ]

}

export async function newInvoice(params: NewInvoice = {}): Promise<Invoice> {

  let invoice = await createInvoice({
    account: params.account || account,
    amount: params.amount || 52.00,
    webhook_url: 'https://anypayx.com/api/v1/test/webhooks'
  })

  return invoice

}

import * as bsv from 'bsv'

export async function generateKeypair(currency: string = 'BSV') {

  var bitcore = getBitcore(currency)

  let privateKey = new bitcore.PrivateKey()

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

export { log } from '../lib'

var request, account, walletBot: WalletBot;

import {Server, server } from '../server/v0/server';
import * as supertest from 'supertest'

export { server, request, account, walletBot }




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

export function authHeaders(username:string, password:string, headers: any = {}): any {

  let token = new Buffer(`${username}:${password}`).toString('base64');

  headers['Authorization'] = `Basic ${token}`

  return headers

}

import { Wallet } from 'anypay-simple-wallet'
import { getBitcore } from '../lib/bitcore';

const WIF = process.env.ANYPAY_SIMPLE_WALLET_WIF || new bsv.PrivateKey().toWIF()

if (!WIF) {

  throw new Error('process.env.ANYPAY_SIMPLE_WALLET_WIF must be set before running tests.')

}

const wallet = Wallet.fromWIF(WIF)

export { wallet } 

beforeEach(() => {

  spy.restore()

})

before(async () => {

  await Server();

  request = supertest(server.listener)

  account = await createAccountWithAddresses()

  walletBot = (await findOrCreateWalletBot(account)).walletBot

})
