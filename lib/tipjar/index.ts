
import * as models from '../models';
import * as bch from 'bitcore-lib-cash';
import * as http from 'superagent';

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

  let tipJar = await models.TipJar.findOne({

    where: {

      account_id,

      currency

    }

  })

  if (!tipJar) {

    let privateKey = await new bch.PrivateKey();

    tipJar = await models.TipJar.create({

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

