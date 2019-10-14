require('dotenv').config();
import {generateInvoice} from '../../lib/invoice';
import { models } from '../../lib';
import * as slp from 'slpjs';
const bch: any = require('bitcore-lib-cash');
import { rpc } from './lib/jsonrpc';

export async function getNewAddress(r: any) {

  let record = await models.Hdkeyaddresses.create({

    currency: 'GOLD',

    xpub_key:process.env.BCH_HD_PUBLIC_KEY

  })

  var bchAddress = deriveAddress(process.env.BCH_HD_PUBLIC_KEY, record.id);

  record.address = slp.Utils.toSlpAddress(bchAddress);

  await record.save()

  rpc.call('importaddress', [bchAddress, 'false', false])
    .then(result => {

      console.log('rpcresult', result); 

    })
    .catch(error => {

      console.log('rpcerror', error); 

    });

  return record.address;

}

async function createInvoice(accountId: number, amount: number) {

  let invoice = await generateInvoice(accountId, amount, 'GOLD');

  return invoice;

}

const currency = 'GOLD';

export {

  currency,

  createInvoice

};

function deriveAddress(xkey, nonce){

  let address = new bch.HDPublicKey(xkey).deriveChild(nonce).publicKey.toAddress().toString()

  return address

}
