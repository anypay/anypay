#!/usr/bin/env ts-node

import * as program from 'commander';

require('dotenv').config();

import { initializeRouterTransaction } from '../lib/router_transaction';
import { log } from '../lib/logger';

program
  .command('init_tx <input_txid> <output_currency> <output_amount> <output_address> [input_currency] [input_amount] [input_address]')
  .action(async (input_txid, output_currency, output_amount, output_address,
    input_currency, input_amount, input_address) => {

    try {

      let routerTx = await initializeRouterTransaction({

        input_txid, output_currency, output_amount, output_address,

        input_currency, input_amount, input_address

      });

      log.info('routertransaction', routerTx.toJSON());

    } catch(error) {

      log.error(error.message);

    }

  });

program.parse(process.argv);

