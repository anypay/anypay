
import { models } from '../models';
const bch: any = require('bitcore-lib-cash');
const bsv: any = require('bsv');
import * as http from 'superagent';

import * as bsvTipjar from './bsv';
import * as bchTipjar from './bch';

import { importAddress } from '../fullnode';

interface iTipJar {
  account_id: number;
  currency: string;
  private_key: string;
  address: string;
  balance?: number;
  utxos?: any[];
}

function getBitcore(currency: String): any {
  switch(currency) {
    case 'BCH':
      return bch;
    case 'BSV':
      return bsv;
    default:
      throw new Error(`tip jars not supported for currency ${currency}`);
  }
}

export async function claimTipjar( account_id: number, currency:string, alias: string){

  switch( currency) {

    case 'BSV':
      return await bsvTipjar.claim(account_id, alias);
    default:
      throw new Error(`tip jars not supported for currency ${currency}`);

  }



}

export async function getTipJar(account_id: number, currency: string) {

  let bitcore = getBitcore(currency);

  let tipJar = await models.Tipjar.findOne({

    where: {

      account_id,

      currency,
  
      claimed : false

    }

  })

  if (!tipJar) {

    let privateKey = new bitcore.PrivateKey();

    let address = privateKey.toAddress().toString()

    await importAddress(currency, address);

    tipJar = await models.Tipjar.create({

      account_id,

      currency,

      address,

      private_key: privateKey.toWIF()

    });

  }

  return tipJar;

}

export async function getTipJarAndBalance(accountId: number, currency: string) {

  let tipJar = await getTipJar(accountId, currency);

  let balance = await getTipJarBalance(tipJar);

  return {

    tipjar: tipJar.toJSON(),

    balance
  }

}

export async function getTipJarBalance(tipJar: any) {

  switch(tipJar.currency) {

    case 'BCH':
      return bchTipjar.getAddressBalance(tipJar.address);
    case 'BSV':
      return bsvTipjar.getAddressBalance(tipJar.address);
    default:
      throw new Error(`tip jars not supported for currency ${tipJar.currency}`);

  }

}

