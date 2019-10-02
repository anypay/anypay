require('dotenv').config()

import * as bsv from 'bsv';

import { rpc } from './lib/jsonrpc';

import {generateInvoice} from '../../lib/invoice';

import {models} from '../../lib/models';

import {statsd} from '../../lib/stats/statsd'

var WAValidator = require('anypay-wallet-address-validator');

async function createInvoice(accountId: number, amount: number) {

  let start = new Date().getTime()

  let invoice = await generateInvoice(accountId, amount, 'BSV');

  statsd.timing('BSV_createInvoice', new Date().getTime()-start)

  statsd.increment('BSV_createInvoice')

  return invoice;

}


export async function getNewAddress(deprecatedParam){

  //Create a new HDKeyAddress 
  let record = await models.Hdkeyaddresses.create({

    currency:'BSV',

    xpub_key:process.env.BSV_HD_PUBLIC_KEY

  })

  record.address = deriveAddress(process.env.BSV_HD_PUBLIC_KEY, record.id)

  await record.save()

  await rpc.call('importaddress', [record.address, "", false, false])

  return record.address;

}

function deriveAddress(xkey, nonce){

  let address = new bsv.HDPublicKey(xkey).deriveChild(nonce).publicKey.toAddress().toString()

  return address 

}

export function validateAddress(address: string){

  let valid = WAValidator.validate( address, 'bitcoin')

  return valid;

}

const name = 'Bitcoin Satoshi Vision';

const currency = 'BSV';

const icon = "https://upload.wikimedia.org/wikipedia/commons/c/c1/Bsv-icon-small.png";

export {

  name,

  currency,

  icon,

  createInvoice

}

