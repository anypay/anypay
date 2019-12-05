
import { models } from '../models';
import * as http from 'superagent';

const bch: any = require("../bitcoin_cash/bitcore").bitcore;

interface iTipJar {
  account_id: number;
  currency: string;
  private_key: string;
  address: string;
  balance?: number;
  utxos?: any[];
}

export async function getTipJar(account_id: number, currency: string) {

  if (currency !== 'BCH') {

    throw new Error('only BCH tip jars supported currently');
  }

  let tipJar = await models.Tipjar.findOne({

    where: {

      account_id,

      currency

    }

  })

  if (!tipJar) {

    let privateKey = new bch.PrivateKey();

    tipJar = await models.Tipjar.create({

      account_id,

      currency,

      private_key: privateKey.toWIF(),

      address: privateKey.toAddress().toString()

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

  if (tipJar.currency !== 'BCH') {

    throw new Error('only BCH tip jars supported currently');
  }

  let resp = await
    http.get(`https://rest.bitcoin.com/v2/address/details/${tipJar.address}`);

  return resp.body.unconfirmedBalance;
}

