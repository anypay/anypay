#!/usr/bin/env ts-node

require('dotenv').config();

let program = require('commander');

import { log, cashback } from '../lib';

import { buildSendToAddress, getAddressBalance, getCashBackBalance } from '../plugins/bch/lib/cashback';
import { _sendToAddress } from '../plugins/dash/lib/cashback';
import { sendToAddress } from '../cashback/lib';

program
  .command('getbalance <currency> [address]')
  .action(async (currency, address) => {
    var balance;

    if (address) {

      balance = await getAddressBalance(address);
      
    } else {

      balance = await getCashBackBalance()

    }

    console.log(balance);

    process.exit(0);

  });

program
  .command('buildsend <currency> <address> <amount>')
  .action(async (currency, address, amount) => {

    let tx = await buildSendToAddress(address, parseInt(amount))

    console.log(tx);

    console.log(tx.toHex());

    process.exit(0);

  });

program
  .command('sendtoaddress <currency> <address> <amount_satoshis>')
  .action(async (currency, address, amountSatoshis) => {

    try {

      let txid = await sendToAddress({
        address,
        amount: parseFloat((amountSatoshis / 100000000).toFixed(6)),
        currency: 'BCH'
      })

      console.log(txid);

    } catch(error) {

      console.log(error);
      console.log(error.message);

    }

    process.exit(0);

  });

program
  .command('dash_sendtoaddress <address> <amount>')
  .action(async (address, amount) => {

    try {

      let txid = await _sendToAddress(
        address,
        parseFloat(amount)
      )

      console.log(txid);

    } catch(error) {

      console.log(error);
      console.log(error.message);

    }

    process.exit(0);

  });

program.parse(process.argv);

