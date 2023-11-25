require('dotenv').config();

import * as Chance from 'chance';

import * as uuid from 'uuid';

const chance = new Chance();

import * as assert from 'assert';

import { registerAccount } from '../lib/accounts';

import { ensureAccessToken } from '../lib/access_tokens'

import { Account } from '../lib/account'

import { Address } from '../lib/addresses'

import { createApp, App } from '../lib/apps'

import { Invoice, createInvoice } from '../lib/invoices'

import { findOrCreateWalletBot, WalletBot } from '../apps/wallet-bot';

//import { initFromConfig } from '../lib/coins'

import { initialize } from '../lib'

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

  let address = await  account.setAddress({ currency: 'BSV', chain: 'BSV', address: keypair.address })

  return [account, address]
}

export const tx = {
  currency: 'BSV',
  chain: 'BSV',
  tx_hex: '010000000a39428dc1eef349536982d76d3e3d104b0ad6fed4fa0fe01a527cf0543b7d4eec000000006a473044022045f794d1d33907241eff32c3fc67de607103bcc84ad7975acbde216e0e38f5e802205529dbbfd28731615d5834ce858c59a90bfade3f15f223db095b60ab1eddbd8a41210365ed492b4ed7f035b4b864b04c544eec9d69bedba9c3d58dc32fd541fb510035ffffffffefb9e742019e1a909b4b8c98572f68df9ed4ab4d584591b886a4db603ef98aa6000000006b483045022100e605530ec2f4ce71546af0ed00cc5b28dee71c511be14583039b03878d4dbbc502206dab9ded2ab8c2f67a091a93d5b5540a7b180c704f0ee9fed99a5747f34271c2412103c848cbf6d9ed20f33b3f8ac28dcca39cb7ef1db3932a072f39bc6425cafa61a7ffffffffa36aabf3514238768a936d75184de65adae0ccbeedada5fd09fb1c727273c1b0000000006a473044022020304bf97e4f15926b2dc9285095ba45434ad74f82e7b0cf8463629620f0178c0220337c81793391622e920c3fa75e7626c414d045920ec71f8910e62243f4fa8880412103c848cbf6d9ed20f33b3f8ac28dcca39cb7ef1db3932a072f39bc6425cafa61a7ffffffff7524fc3006406e4b30abf55f775c2ff565163ee16f98aba8b64cbb0f774c879f000000006a47304402202acb74326262ab4d0b5253fc02b31ab436f73a4d3b818d52ae01dbd025fbcc57022033942db97e28838b9560c7ddde5c84cde2e297e5c370c84645366902cc8a1fc5412103c848cbf6d9ed20f33b3f8ac28dcca39cb7ef1db3932a072f39bc6425cafa61a7ffffffff24b0d52b06314b899eac83fc6c5f791354744b3cfc9ac86bd45b816e705ae784000000006b483045022100e93edb036392b9bed93f2bb2b99a331d1c326080f985b8764fdde0e09b33ab02022060dc8e711f1e7ea6c2232f59ddc69399560afdc279bf5792a3ff80efb1206f8c412103c848cbf6d9ed20f33b3f8ac28dcca39cb7ef1db3932a072f39bc6425cafa61a7ffffffff396ab152805481e38c37344dc3b51945b66cb09d166d40f9d165c873010bfa12000000006a4730440220527a6a2dcdb982fbfc98793a7ccee928e510c74224573daf915364c90b0df408022040ee018f4425e14feee2300806d79c8e4ef967eef8495350dcbda134da5ca2da412103c848cbf6d9ed20f33b3f8ac28dcca39cb7ef1db3932a072f39bc6425cafa61a7ffffffff87e98e98a4634bd98932391af9afad2a671e16796d194e064fb4a0e173f3b125000000006a4730440220263b63e3059785672c8551796a602227006bb67328554e8ae69807d8a5b0405702200be94a72aa46e8fa9ee44d125bc5f8b05b2775c2fa6f8fa0add473c85c2db51f412103c848cbf6d9ed20f33b3f8ac28dcca39cb7ef1db3932a072f39bc6425cafa61a7ffffffff47862c950357ffa82f19eea5f2f77a3ff6d64e68055298c6b35350881aa0e360000000006a4730440220466a3dac837cd3cb80b26420372a673b1ce6a8cff921c078d4d7b638e838aa3702202eefe32585e505a2ce38a05c230d1aa9d5b701d962e394ccaa6a0854e854c30f412103c848cbf6d9ed20f33b3f8ac28dcca39cb7ef1db3932a072f39bc6425cafa61a7ffffffff7db09172ebc4812857684f5d0b8fc244530c515b1fe00acf2f92195b3683a05e000000006b483045022100bb613a67445810eee4ebe134997e9678877f2e8e6f1290cb79cfa6232a4a6e8f0220076b2f2fb8c46e0ed9d5575bfa37ce646d0299670eba2a69017234baef758c60412103c848cbf6d9ed20f33b3f8ac28dcca39cb7ef1db3932a072f39bc6425cafa61a7ffffffffba4ebd3576e2a96d516c38d1452ed6155fcd1f44e0398ee9c66807980ac969fd000000006b48304502210092ee226ecd3a62c1f34b8318802f3c2706f35545a41461071240a13ff7753e8d02205bc713911ae0f00816ab201636c1d1a0fc39b426c0f9d02345920c1766a714b1412103d060ac612d77f1dde615d2d71cc0ad3ae9cc00e1d3dc15e492e578ff44d252f9ffffffff03f0537500000000001976a9143db59b7e157913df26c949269a6cfd16923a242888acb80b0000000000001976a914fde8f61612beecbf7532765d17ce9c36c860187888acd194d600000000001976a9143de59a7df3f1479e00d7b5cf4abcdfd0252d30e688ac00000000',
  tx_id: '6805c46f53b87cd350dc185ff2c4a48d2547bf86a76c25e9bb23a1b936092763'
}

export async function payInvoice(invoice: Invoice): Promise<Payment> {

  let payment = await recordPayment(invoice, {
    txid: tx.tx_id,
    currency: tx.currency,
    txhex: tx.tx_hex
  })

  await invoice.update({
    invoice_currency: 'BSV',
    denomination: 'USD',
    denomination_amount_paid: 52.00,
    status: 'paid',
    hash: createHash('sha256').update(uuid.v4()).digest().toString('hex')
  })

  return payment
  
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

  await account.setAddress({ currency: 'BSV', chain: 'BSV', address })

  let { address: bch_address } = await generateKeypair('BCH')

  await account.setAddress({ currency: 'BCH', chain: 'BCH', address: bch_address })

  let { address: dash_address } = await generateKeypair('DASH')
  
  await account.setAddress({ currency: 'DASH', chain: 'DASH', address: dash_address })

  return account
}

export async function setAddresses(account: Account): Promise<Account> {

  let { address } = await generateKeypair()

  await account.setAddress({ currency: 'BSV', chain: 'BSV', address })

  let { address: bch_address } = await generateKeypair('BCH')

  await account.setAddress({ currency: 'BCH', chain: 'BCH', address: bch_address })

  let { address: dash_address } = await generateKeypair('DASH')
  
  await account.setAddress({ currency: 'DASH', chain: 'DASH', address: dash_address })

  return account
}

export async function newAccountWithInvoice(params: NewAccountInvoice = {}): Promise<[Account, Invoice]> {

  let account = await createAccount()

  let { address } = await generateKeypair()

  await account.setAddress({ currency: 'BSV', chain: 'BSV', address })

  let { address: bch_address } = await generateKeypair('BCH')

  await account.setAddress({ currency: 'BCH', chain: 'BCH', address: bch_address })

  let { address: dash_address } = await generateKeypair('DASH')
  
  await account.setAddress({ currency: 'DASH', chain: 'DASH', address: dash_address })

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

var request, account, walletBot: WalletBot, app: App;

import {Server, server } from '../server/v0/server';
import * as supertest from 'supertest'

export { server, request, account, walletBot, app }




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

import { Wallet } from '../packages/simple-wallet'
import { getBitcore } from '../lib/bitcore';
import { Payment, recordPayment } from '../lib/payments';
import { createHash } from 'crypto';

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

  console.log('initialize')
  await initialize()

  console.log('initialized')

  await Server();

  //await initFromConfig()

  request = supertest(server.listener)

  account = await createAccountWithAddresses()

  app = await createApp({ name: 'test', account_id: account.id })

  walletBot = (await findOrCreateWalletBot(account)).walletBot

})

