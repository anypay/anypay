
require('dotenv').config();

import { fromSatoshis, Payment } from '../../lib/pay'

//import * as blockcypher from '../../lib/blockcypher'

import * as blockchair from '../../lib/blockchair'


import * as dash from '@dashevo/dashcore-lib';

export { dash as bitcore }

import {oneSuccess} from 'promise-one-success'

var WAValidator = require('anypay-wallet-address-validator');

export async function submitTransaction(rawTx: string) {

  return oneSuccess([
    blockchair.publish('dash', rawTx),
    //blockcypher.publishDASH(rawTx)
  ])

}

export async function broadcastTx(rawTx: string) {

  return oneSuccess([
    blockchair.publish('dash', rawTx),
    //blockcypher.publishDASH(rawTx)
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

export async function getNewAddress(record: any) {

  return record.value;

}

const currency = 'DASH';

export {

  currency

};
