
require('dotenv').config();

import {createWebhook} from './lib/blockcypher';

import { fromSatoshis, Payment } from '../../lib/pay'

import { any } from 'bluebird'

import {generateInvoice} from '../../lib/invoice';

import {log, models} from '../../lib'

import { rpc } from './lib/jsonrpc';

import * as blockcypher from '../../lib/blockcypher'
import * as blockchair from '../../lib/blockchair'

import * as http from 'superagent';

import * as dash from '@dashevo/dashcore-lib';

export { dash as bitcore }

import {oneSuccess} from 'promise-one-success'

var WAValidator = require('anypay-wallet-address-validator');

export async function submitTransaction(rawTx: string) {

  return oneSuccess([
    //blockchair.publish(rawTx, 'dash'),
    blockcypher.publishDASH(rawTx)
  ])

}

export async function broadcastTx(rawTx: string) {

  return oneSuccess([
    //blockchair.publish(rawTx, 'dash'),
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

  let invoice = await generateInvoice(accountId, amount, 'DASH');

  return invoice;

}

export async function getNewAddress(record: any) {

  return record.value;

}

const currency = 'DASH';

export {

  currency

};
