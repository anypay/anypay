#!/usr/bin/env ts-node

import * as program from 'commander';

import { rpc } from '../plugins/dash/lib/jsonrpc';
import { channel, awaitChannel } from '../lib/amqp';
import { rawTxToPayment } from '../plugins/dash/lib';

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

program.parse(process.argv);

