#!/usr/bin/env ts-node

require('dotenv').config();

import * as bch from 'bitcore-lib-cash';

import * as program from 'commander';

import { rpcCall } from '../lib/bch/jsonrpc';

//import * as BITBOX from 'bitbox-sdk';

program
  .command('sendtoaddress [address] [amount]')
  .action(async (address, amount) => {

    var privateKey = new bch.PrivateKey(process.env.BCH_WIF);
    var publicKey = privateKey.toPublicKey();
    var script = new bch.Script(publicKey.toAddress()).toHex();
    var utxo = {
      "txId" : "66b0439fea0157519c22c4f5b9d3b7d7547260d127c7a9b73e87c10c1d1a97f9",
      "outputIndex" : 1,
      "address" : publicKey.toAddress().toString(),
      "script" : script,
      "satoshis" : 159322
    };

    var transaction = new bch.Transaction()
        .from(utxo)
        .addData(
          Buffer.from('6d01', 'hex'),
          Buffer.from('Bitcoin Cash Back by Anypay')
        )
        .to('bitcoincash:qrnsnpyhl44xyqemhngpjqw26xteyldte5y7vtdzkd', 1000)
        .sign(privateKey);

    var tx_hex = transaction.serialize();
    console.log("tx_hex",tx_hex);

    try {

      let resp = await rpcCall('sendrawtransaction', [tx_hex]);

      console.log(resp);
    } catch(error) {
      console.log(error);
    }

  });

program
  .command('newkeypair')
  .action(async () => {

    let privatekey = new bch.PrivateKey();

    let address = privatekey.toAddress().toString();

    console.log({

      address,

      wif: privatekey.toWIF()

    });

  });

program
  .command('buildbchback <parentTxid>')
  .action(async (parentTxid) => {

    // use bch-back address
    let address = 'bitcoincash:qp9jz20u2amv4cp5wm02zt7u00lujpdtgy48zsmlvp';

    let utxos = await rpcCall('listunspent', [0, 9999999, [address]]);

    console.log(utxos[0]);

    const utxo = bch.Transaction.UnspentOutput({
      address: utxos[0].address, 
      txId: utxos[0].txid,
      outputIndex: utxos[0].vout,
      satoshis: utxos[0].amount * 10000000,
      scriptPubKey: utxos[0].scriptPubKey
    });

    console.log('UTXO', utxo);

    let op_return = [];

//    op_return.push(Buffer.from(process.env.ANYPAY_CASHBACK_BITCOIN_PROTOCOL_ADDRESS).toString('hex'));
      op_return.push(Buffer.from(parentTxid).toString('hex'));
//    op_return.push(Buffer.from('Bitcoin Cash Back™ by Anypay').toString('hex'));

    console.log(op_return);

    const script = bch.Script.fromASM(op_return.join(' '));

    console.log(script.toString());

    let tx = new bch.Transaction();

    tx
      .from(utxo)
      .addOutput(new bch.Transaction.Output({ script , satoshis: 0 }))
      .change(new bch.Address(address));

    const feeb = 1.1;
    const minimumOutputValue = 546

    const fee = Math.max(Math.ceil(tx._estimateSize() * feeb), minimumOutputValue)

    tx.fee(fee);

    let privkey = new bch.PrivateKey(process.env.CASHBACK_BCH_WIF);

    tx.sign(privkey);

    console.log(tx.toString());

    try {

      let resp = await rpcCall('sendrawtransaction', [tx.toString()]);

      console.log(resp);

    } catch(error) {
      console.error(error);
    }

    process.exit(0);

  });

  /*

program
  .command('buildscript <parentTxid>')
  .action(async (parentTxid) => {

    let setMemo = (memo) => {

      let s = new BITBOX.Script();

      let script = [
        s.opcodes.OP_RETURN,
        Buffer.from(process.env.ANYPAY_CASHBACK_BITCOIN_PROTOCOL_ADDRESS),
        Buffer.from(parentTxid),
        Buffer.from(memo)
      ];

      return s.encode(script)

    }

    let memo = setMemo('Bitcoin Cash Back™ by Anypay');

    console.log(memo.toString('hex'));

  });
  */

if (require.main === module) {

  program.parse(process.argv);

} else {

  module.exports = program;

}

