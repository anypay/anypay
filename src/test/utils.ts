/*
    This file is part of anypay: https://github.com/anypay/anypay
    Copyright (c) 2017 Anypay Inc, Steven Zeiler

    Permission to use, copy, modify, and/or distribute this software for any
    purpose  with  or without fee is hereby granted, provided that the above
    copyright notice and this permission notice appear in all copies.

    THE  SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
    WITH  REGARD  TO  THIS  SOFTWARE  INCLUDING  ALL  IMPLIED  WARRANTIES  OF
    MERCHANTABILITY  AND  FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
    ANY  SPECIAL ,  DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
    WHATSOEVER  RESULTING  FROM  LOSS  OF USE, DATA OR PROFITS, WHETHER IN AN
    ACTION  OF  CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
    OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
//==============================================================================

require('dotenv').config();

import Chance from 'chance';

import * as uuid from 'uuid';

const chance = new Chance();

import assert from 'assert';

import { registerAccount } from '@/lib/accounts';

import { ensureAccessToken } from '@/lib/access_tokens'

import { setAddress } from '@/lib/addresses';

export { log } from '@/lib/log'

import supertest from "supertest";

import {
  accounts as Account,
  addresses as Address,
  Apps as App,
  invoices as Invoice,
  WalletBots as WalletBot,
} from '@prisma/client'

import { createInvoice } from '@/lib/invoices'

import { findOrCreateWalletBot } from '@/apps/wallet-bot';

//import { initFromConfig } from '../lib/coins'

import { config, initialize } from '@/lib'

let account: Account;

export async function generateAccount(): Promise<Account>{
  return registerAccount(chance.email(), chance.word());
}

export async function createAccount(): Promise<Account> {
  return registerAccount(chance.email(), chance.word());
}

export async function createAccountWithAddress(): Promise<[Account, Address]> {
  
  const account  = await registerAccount(chance.email(), chance.word());

  let keypair = await generateKeypair()

  let address = await setAddress(account, { currency: 'BSV', chain: 'BSV', value: keypair.address })

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

  await prisma.invoices.update({
    where: { id: invoice.id },
    data: {
      currency: 'USD',
      status: 'paid',
      hash: createHash('sha256').update(uuid.v4()).digest().toString('hex')    }
  })

  return payment
  
}


interface NewAccountInvoice {
  amount?: number;
}

interface NewInvoice {
  amount?: number;
  account: Account;
}

export async function createAccountWithAddresses(): Promise<Account> {

  const account = await registerAccount(chance.email(), chance.word());

  let { address } = await generateKeypair()

  await setAddress(account, { currency: 'BSV', chain: 'BSV', value: address })

  let { address: bch_address } = await generateKeypair('BCH')

  await setAddress(account, { currency: 'BCH', chain: 'BCH', value: bch_address })

  let { address: dash_address } = await generateKeypair('DASH')
  
  await setAddress(account, { currency: 'DASH', chain: 'DASH', value: dash_address })

  return account
}

export async function setAddresses(account: Account): Promise<Account> {

  let { address } = await generateKeypair()

  await setAddress(account, { currency: 'BSV', chain: 'BSV', value: address })

  let { address: bch_address } = await generateKeypair('BCH')

  await setAddress(account, { currency: 'BCH', chain: 'BCH', value: bch_address })

  let { address: dash_address } = await generateKeypair('DASH')
  
  await setAddress(account, { currency: 'DASH', chain: 'DASH', value: dash_address })

  return account
}

export async function newAccountWithInvoice(params: NewAccountInvoice = {}): Promise<[Account, Invoice]> {

  let account = await createAccount()

  await setAddresses(account)

  let invoice = await createInvoice({
    account,
    amount: params.amount || 10,
    currency: 'USD'
  })

  return [ account, invoice ]

}

export async function newInvoice(params: NewInvoice): Promise<Invoice> {

  let invoice = await createInvoice({
    account: params.account,
    amount: params.amount || 52.00,
    currency: 'USD',
    webhook_url: 'https://anypayx.com/api/v1/test/webhooks'
  })

  return invoice

}

import { bsv } from 'scrypt-ts'

export async function generateKeypair(currency: string = 'BSV') {

  var bitcore = getBitcore(currency)

  let privateKey = new bitcore.PrivateKey()

  let address = privateKey.toAddress()

  return {

    privateKey: privateKey.toWIF(),

    address: address.toString()

  }

}

import chai from 'chai'

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


var request: supertest.Agent, walletBot: WalletBot, app: App;

import { NewServer } from '@/server/v0/server';

import { Server } from '@hapi/hapi'

var server: Server;

export { server, request, account, walletBot, app }

export async function authRequest(account: Account, params: any) {

  const jwt = await generateAccountToken({ account_id: account.id, uid: String(account.uid) })

  if (!params.headers) { params['headers'] = {} }

  //params.headers['Authorization'] = `Bearer ${accessToken.jwt}`
  params.headers['Authorization'] = `Bearer ${jwt}`

  return server.inject(params)

}

export async function v0AuthRequest(account: Account, params: any) {

  if (!params.headers) { params['headers'] = {} }

  params.headers['Authorization'] = `Basic ${await createAuthHeader(account)}`

  return server.inject(params)

}

export async function createAuthHeader(account: Account): Promise<string> {

  let accessToken = await ensureAccessToken(account)

  return new Buffer(accessToken.uid + ':').toString('base64');

}

export function auth(account: Account, version=1) {

  var strategy = authRequest;

  if (version === 0) {

    strategy = v0AuthRequest

  }

  return async function(req: Request) {

    return strategy(account, req)

  }

}

export function authHeaders(username:string, password:string, headers: any = {}): any {

  let token = new Buffer(`${username}:${password}`).toString('base64');

  headers['Authorization'] = `Basic ${token}`

  return headers

}

import { getBitcore } from '@/lib/bitcore';
import { recordPayment } from '@/lib/payments';
import { createHash } from 'crypto';
import prisma from '@/lib/prisma';
import { generateAccountToken } from '@/lib/jwt';
import { Request } from '@hapi/hapi';

import { payments as Payment } from '@prisma/client'

const WIF = config.get('ANYPAY_SIMPLE_WALLET_WIF') || new bsv.PrivateKey().toWIF()

if (!WIF) {

  throw new Error('ANYPAY_SIMPLE_WALLET_WIF environment variable must be set before running tests.')

}

//const wallet = Wallet.fromWIF(WIF)

//export { wallet } 

beforeEach(() => {

  spy.restore()

})

import { access_tokens as AccessToken } from '@prisma/client'

var jwt: string, accessToken: AccessToken;

export { jwt, accessToken } 

before(async () => {

  await initialize()

  server = await NewServer()

  request = supertest(server.listener)

  account = await createAccountWithAddresses()

  accessToken = await ensureAccessToken(account)

  jwt = await generateAccountToken({ account_id: account.id, uid: String(account.uid) })

  walletBot = (await findOrCreateWalletBot(account)).walletBot

})

