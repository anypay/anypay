
require('dotenv').config();

import {createWebhook} from './lib/blockcypher';

import { fromSatoshis, Payment } from '../../lib/pay'

import { any } from 'bluebird'

import {generateInvoice} from '../../lib/invoice';

import * as chainSoAPI from '../../lib/chainSoAPI';

import {Invoice} from '../../types/interfaces';

import {statsd} from '../../lib/stats/statsd'

import {log, xpub, models} from '../../lib'

import { rpc } from './lib/jsonrpc';

import * as blockcypher from '../../lib/blockcypher'
import * as blockchair from '../../lib/blockchair'

import { I_Address } from '../../types/interfaces';

import * as http from 'superagent';

import * as address_subscription from '../../lib/address_subscription';

import * as dash from '@dashevo/dashcore-lib';

import {oneSuccess} from 'promise-one-success'

var WAValidator = require('anypay-wallet-address-validator');

export async function submitTransaction(rawTx: string) {

  return oneSuccess([
    blockchair.publish(rawTx, 'dash'),
    blockcypher.publishDASH(rawTx)
  ])

}

export async function broadcastTx(rawTx: string) {

  return oneSuccess([
    blockchair.publish(rawTx, 'dash'),
    blockcypher.publishDASH(rawTx)
  ])

}

export function transformHexToPayments(hex: string): Payment[]{

  let tx = new dash.Transaction(hex)

  return tx.outputs.map((output)=>{

          return {
            currency: 'DASH',
            hash: tx.hash.toString(),
            amount: fromSatoshis(output.satoshis),
            address: output.script.toAddress().toString()
          }
  })

}

export function validateAddress(address: string){

  let valid = WAValidator.validate( address, 'DASH')

  return valid

}

export function transformAddress(address: string){

  if (address.match(':')) {

    address = address.split(':')[1]

  }

  return address;

}


export async function createInvoice(accountId: number, amount: number) {

  let start = new Date().getTime()

  log.info('about to generate dash invoice');

  let invoice = await generateInvoice(accountId, amount, 'DASH');

  log.info('generated dash invoice');

  statsd.timing('DASH_createInvoice', new Date().getTime()-start)
  
  statsd.increment('DASH_createInvoice')

  return invoice;

}

async function createAddressForward(record: I_Address) {

  let url = "https://dash.anypayinc.com/v1/dash/forwards";

  let callbackBase = process.env.API_BASE || 'https://api.anypayinc.com';

  let resp = await http.post(url).send({

    destination: record.value,

    callback_url: `${callbackBase}/dash/address_forward_callbacks`

  });

  return resp.body.input_address;

}

export async function getNewAddress(record: I_Address) {

  var address;

  if (record.value.match(/^xpub/)) {

    address = xpub.generateAddress('DASH', record.value, record.nonce);

    await models.Address.update({

      nonce: record.nonce + 1

    },{

      where: {

        id: record.id

      }
    
    });

    return address;

  } else {

    return record.value;

  }

}


async function checkAddressForPayments(address:string, currency:string){

  log.info(`dash.checkAddressForPayments.${address}`);

  let start = new Date().getTime();

  let payments = await chainSoAPI.checkAddressForPayments(address,currency);

  log.info(`dash.checkAddressForPayments.result`, payments);

  statsd.timing('DASH_checkAddressForPayments', new Date().getTime()-start);

  statsd.increment('DASH_checkAddressForPayments');

  return payments;
}

const currency = 'DASH';

const poll = true;

export {

  currency,

  checkAddressForPayments,

  poll,

  rpc

};
