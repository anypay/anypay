#!/usr/bin/env ts-node

require('dotenv').config();

import * as program from 'commander';
import * as datacash from 'datacash';
import * as cashaddr from 'bchaddrjs';
import { rpcCall } from '../lib/bch/jsonrpc';

program
  .command('keypair')
  .action(async () => {

    let privkey = new datacash.bch.PrivateKey(process.env.CASHBACK_BCH_TEST_WIF);

    console.log(privkey.toWIF());

    console.log(privkey.toAddress().toString());
    console.log(cashaddr.toLegacyAddress(privkey.toAddress().toString()));

  });

interface NewBchBack {
  txid: string;
  address: string;
  satoshis: number;
}

async function sendBCHBackWithMemo(opts: NewBchBack) {

    console.log(opts);

  return new Promise((resolve, reject) => {

    let privkey = new datacash.bch.PrivateKey(process.env.CASHBACK_BCH_TEST_WIF)

    const tx = {
      safe: true,
      data: [
        process.env.ANYPAY_CASHBACK_BITCOIN_PROTOCOL_ADDRESS,
        JSON.stringify({
          txid: opts.txid,
          address: opts.address,
          amount: opts.satoshis
        }),
        "GetBCHBack.com by Anypay"
      ],
      cash: {
        key: privkey.toString(),
        fee: 1000/*,
        to: [{
          address: new datacash.bch.Address(opts.address),
          value: opts.satoshis
        }]*/
      }
    };

    datacash.build(tx, async function(err, tx) {

      if (err) { return reject(err) }

      /**
      * res contains the generated transaction object, powered by bsv
      * You can check it out at https://github.com/moneybutton/bsv/blob/master/lib/transaction/transaction.js
      * Some available methods you can call on the tx object are:
      * 1. tx.toString() => Export as string
      * 2. tx.toObject() => Inspect the transaction as JSON object
      **/

      console.log(tx, tx.toObject());

      let resp = await rpcCall('sendrawtransaction', [tx.toString()]);

      resolve(resp);

    });

  });

}

program
  .command('sendbchback <txid> <address> <satoshis>')
  .action(async (txid, address, satoshis) => {

    let resp = await sendBCHBackWithMemo({ txid, address, satoshis })

    console.log(resp);

    process.exit(0);

  });

program
  .parse(process.argv);

