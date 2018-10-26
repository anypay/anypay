#!/usr/bin/env ts-node

require('dotenv').config();

const program = require('commander')

import { getPriceOfOneDollarInVES } from '../lib/prices/ves';
import { getAllPrices } from '../lib/prices';

program
  .command('getvesprice')
  .action(async () => {

    let price = await getPriceOfOneDollarInVES();

    console.log(`one dollar equals ${price}`);

  });

program
  .command('getallprices')
  .action(async () => {

    let allPrices = await getAllPrices();

    console.log(allPrices);

  });

program
  .parse(process.argv);

