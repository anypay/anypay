
require('dotenv').config();

import { fromSatoshis, Payment } from '../../lib/pay'

import { blockchair, blockcypher } from '../../lib'

import * as dash from '@dashevo/dashcore-lib';

export { dash as bitcore }

import * as insight from './lib/insight'

var WAValidator = require('anypay-wallet-address-validator');

import { BroadcastTxResult } from '../../lib/plugins'

export async function broadcastTx(rawTx: string): Promise<BroadcastTxResult> {

  const broadcastProviders: Promise<BroadcastTxResult>[] = [

    blockchair.publish('dash', rawTx),

    blockcypher.publish('dash', rawTx),

    insight.broadcastTx(rawTx)

  ]

  return oneSuccess<BroadcastTxResult>(broadcastProviders)

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

function oneSuccess<T>(promises): Promise<T> {
  return Promise.all(promises.map(p => {
    // If a request fails, count that as a resolution so it will keep
    // waiting for other possible successes. If a request succeeds,
    // treat it as a rejection so Promise.all immediately bails out.
    return p.then(
      val => Promise.reject(val),
      err => Promise.resolve(err)
    );
  })).then(
    // If '.all' resolved, we've just got an array of errors.
    errors => Promise.reject(errors),
    // If '.all' rejected, we've got the result we wanted.
    val => Promise.resolve(val)
  );
}
