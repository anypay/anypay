require('dotenv').config()

import * as bsv from 'bsv';

import { rpc } from './lib/jsonrpc';

import {generateInvoice} from '../../lib/invoice';

import {models} from '../../lib/models';

import {statsd} from '../../lib/stats/statsd'

const polynym = require('polynym');

var WAValidator = require('anypay-wallet-address-validator');

async function createInvoice(accountId: number, amount: number) {

  let start = new Date().getTime()

  let invoice = await generateInvoice(accountId, amount, 'BSV');

  statsd.timing('BSV_createInvoice', new Date().getTime()-start)

  statsd.increment('BSV_createInvoice')

  return invoice;

}

export async function forwardAllUTXOsToAddress(privKey: string,receiver:string){

  //get all utxos 
  //create a transcation with utxo's 
       
  let sender = new bsv.PrivateKey(privKey).toAddress().toString()

  console.log( privKey, sender, receiver)

  let resp = (await rpc.call('listunspent', [0, 1000000, [sender]])).result;

  console.log('list unspent', resp)

  let utxos = resp.map((elem)=>{
    return {
      "txId": elem.txid,
      "outputIndex": elem.vout, 
      "satoshis": bsvToSatoshis(elem.amount),
      "address" : elem.address,
      "script": elem.scriptPubKey 
    }
  })

  console.log('utxos', utxos)

  let amountToSpend = 0;
  
  utxos.forEach(elem => amountToSpend += elem.satoshis)

  amountToSpend -= bsvToSatoshis(.0001);

  console.log('amount to spend', amountToSpend)

  let tx = new bsv.Transaction()
    .from(utxos)
    .to(receiver, amountToSpend)
    .sign(new bsv.PrivateKey(privKey));

  console.log('signed tx', tx)

  let txid =  await rpc.call('sendrawtransaction', [tx.toString()])

  console.log('txid', txid)

  return txid;
}

function bsvToSatoshis(bsv): number{
  return bsv*100000000 | 0;
}


export async function resolveAlias(alias: string){

  let address =  await polynym.resolveAddress(alias);

  if( validateAddress(address.address) ){

    return address.address

  }else{
    throw new Error(`Cannot resolve BSV alias ${alias}`);

  }
}


export async function getNewAddress(deprecatedParam){

  //Create a new HDKeyAddress 
  let record = await models.Hdkeyaddresses.create({

    currency:'BSV',

    xpub_key:process.env.BSV_HD_PUBLIC_KEY

  })

  record.address = deriveAddress(process.env.BSV_HD_PUBLIC_KEY, record.id)

  await record.save()

  rpc.call('importaddress', [record.address, "", false, false])

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

