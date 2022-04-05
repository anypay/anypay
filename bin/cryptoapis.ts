#!/usr/bin/env ts-node

require("dotenv").config()

import * as program from 'commander';

import * as http from 'superagent'

program
  .command('utxos <address>')
  .action(async (address) => {

    try {

      const url = `https://rest.cryptoapis.io/v2/blockchain-data/dash/mainnet/addresses/${address}/unspent-outputs`

      let {body} = await http
        .get(url)
        .set('X-Api-Key', process.env.CRYPTOAPIS_KEY)

      console.log(body.data.items)

    } catch(error) {

      console.error(error)

    }
  
  });
  
program
  .parse(process.argv);

