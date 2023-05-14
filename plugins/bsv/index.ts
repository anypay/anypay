require('dotenv').config()

import * as bsv from 'bsv';

import { fromSatoshis } from '../../lib/pay'

import * as taal from './lib/taal'

import * as run from './lib/run'

import * as whatsonchain from './lib/whatsonchain'

import { BroadcastTx, BroadcastTxResult, Confirmation, VerifyPayment, Transaction, Plugin } from '../../lib/plugin'

import { oneSuccess } from 'promise-one-success'

import { blockchair, log } from '../../lib';

import { Account } from '../../lib/account'

import { Address } from '../../lib/addresses'

import { findOne } from '../../lib/orm'

const polynym = require('polynym');

export default class BSV extends Plugin {

  currency: string = 'BSV'

  chain: string = 'BSV'

  decimals: number = 8

  async getConfirmation(txid: string): Promise<Confirmation> {

    throw new Error() //TODO

  }

  async broadcastTx({txhex}: BroadcastTx): Promise<BroadcastTxResult> {

    const broadcastProviders: Promise<BroadcastTxResult>[] = [

      taal.broadcastTransaction(txhex),

      blockchair.publish('bitcoin-sv', txhex),

      run.broadcastTx(txhex)

    ]

    return oneSuccess<BroadcastTxResult>(broadcastProviders)

  }

  async getTransaction(txid: string): Promise<Transaction> {

    let hex = await whatsonchain.getTransaction(txid)

    return { hex }

  }

  async verifyPayment(params: VerifyPayment): Promise<boolean> {

    return false
  }

  async getNewAddress(account: Account): Promise<string> {

    let address = await findOne<Address>(Address, {
      where: {
        account_id: account.get('id'),
        currency: 'BSV',
        chain: 'BSV'
      }
    })

    if (address.get('paymail') && address.get('paymail').match('@')) {

      let resolved = await polynym.resolveAddress(address.get('paymail'))

      return resolved.address

    } else {

      return address.get('value');

    }

  }

  async validateAddress(address: string): Promise<boolean> {

    try {

      new bsv.Address(address)

      return true

    } catch(error) {

      log.debug('plugin.bsv.validateAddress.error', error)

      return false

    }

  }

  async transformAddress(alias: string){

    try {

      if (alias.match(':')) {

        alias = alias.split(':')[1];

      }

      alias = alias.split('?')[0];

      return (await polynym.resolveAddress(alias)).address;

    } catch(error) {

      throw new Error('invalid BSV address');

    }

  }

}

export async function transformAddress(alias: string){

  try {

    try{
            
      if( isCashAddress(alias) ){
      
        return toLegacyAddress(alias)

      }


    }catch(err){

    }

    if (alias.match(':')) {

      alias = alias.split(':')[1];

    }

    alias = alias.split('?')[0];

    return (await polynym.resolveAddress(alias)).address;

  } catch(error) {
    throw new Error('invalid BSV address');
  }

}


/*
  TODO: Re-implement once it is known to be working through tests
export async function getNewAddress(address: Address): Promise<string>{

  const paymail = address.get('paymail')

  if (paymail) {

    let resolved = await polynym.resolveAddress(paymail)

    return resolved.address

  } else {

    return address.get('value');

  }

}
*/

export function validateAddress(address: string){

  let valid = WAValidator.validate( address, 'bitcoin')

  return valid;

}

=======
>>>>>>> 7726fbcc (Frame New Plugins, Rework Existing Plugins)
export { bsv as bitcore }

