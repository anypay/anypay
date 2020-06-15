#!/usr/bin/env ts-node

import { RPCSimpleWallet } from '../';

import { BigNumber } from 'bignumber.js'

import * as program from 'commander';

const WALLET = 'Xxie51C2VsBC1bLUuWaCXKdJwEwtNzZPfU';

program
  .command('getbalance <account>')
  .action(async (account) => {

    let wallet = new RPCSimpleWallet('BCH', account || WALLET);

    let balance = await wallet.getAddressUnspentBalance();

    console.log('balance', balance);

    process.exit(0);
  });

program
  .command('sendtoaddress <account> <destination> <amount>')
  .action(async (account, destination, amount) => {

    let wallet = new RPCSimpleWallet('BCH', account);

    let balance = await wallet.getAddressUnspentBalance();

    let payment = await wallet.sendToAddress(destination, parseFloat(amount));

    console.log('payment', payment);

    process.exit(0);

  });


program.parse(process.argv);
