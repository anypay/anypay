#!/usr/bin/env ts-node

import * as program from 'commander';

import { rpc } from '../plugins/dash/lib/jsonrpc';
import { channel, awaitChannel, wait } from '../lib/amqp';
import { rawTxToPayment } from '../plugins/dash/lib';
import { database } from '../lib';

program
  .command('rectifydash <hash>')
  .action(async (hash) => {

    await awaitChannel();

    try {

      let tx = await rpc.call('gettransaction', [hash]);

      console.log(tx);

      let rawTx = await rpc.call('decoderawtransaction', [tx.result.hex]);

      console.log(rawTx);

      let payments = rawTxToPayment(rawTx.result);

      console.log(payments); 

      payments.forEach(async (payment) => {

        await channel.publish('anypay.payments', 'payment', new Buffer(
          JSON.stringify(payment)
        ));

      });

    } catch(error) {

      console.error(error);

    }

  });

program
  .command('reroutefailed <currency>')
  .action(async (currency) => {

    let result = await database.query(`select * from invoices where status != 'unpaid'
    and output_hash is null and currency = '${currency}' order by "createdAt" desc limit 100;`);

    let exchange = `${currency.toLowerCase()}.anypayinc.com`;

    let channel = await awaitChannel();

    for (let i =0; i < result[0].length; i++) {
      let invoice = result[0][i];
      await wait(100);


      await channel.publish(exchange, 'walletnotify', Buffer.from(invoice.hash));
    }

    process.exit(0);

  });

program.parse(process.argv);

