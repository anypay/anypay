#!/usr/bin/env ts-node

require("dotenv").config()

import * as http from 'superagent'

import { Command } from 'commander';
const program = new Command();

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

