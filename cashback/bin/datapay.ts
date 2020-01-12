#!/usr/bin/env ts-node

import * as program from 'commander';
import * as datapay from 'datapay';

program
  .command('buildtx')
  .action(async () => {
  
    const tx = {
      safe: true,
      data: ["0x6d02", Buffer.from("Abc"), "hello world"],
      pay: {
        fee: 400,
        to: [{
          address: "",
          value: 1000
        }]
      }
    }

    datapay.build(tx, function(err, tx) {
      /**
      * res contains the generated transaction object, powered by bsv
      * You can check it out at https://github.com/moneybutton/bsv/blob/master/lib/transaction/transaction.js
      * Some available methods you can call on the tx object are:
      * 1. tx.toString() => Export as string
      * 2. tx.toObject() => Inspect the transaction as JSON object
      **/

      console.log(tx.toObject());

      process.exit(0);

    });
  
  });

program
  .parse(process.argv);
