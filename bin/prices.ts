#!/usr/bin/env ts-node

require('dotenv').config();

const program = require('commander')

import { getPriceOfOneDollarInVES } from '../lib/prices/ves';
import { getVESPrice } from '../lib/localbitcoins';
import { createConversion } from '../lib/prices';

program
  .command('convert <baseamount> <basecurrency> <targetcurrency>')
  .action(async (value, currency, targetCurrency) => {

    try {

      let conversion = await createConversion({

        value, currency 

      }, targetCurrency);

      console.log(conversion);

    } catch(error) {

      console.error(error.message);

    }

  });

program
  .command('getvesprice')
  .action(async () => {

    let usdPrice = await getPriceOfOneDollarInVES();

    console.log(`one USD equals ${usdPrice} VES`);

  });

program
  .command('getvespricelocalbitcoins')
  .action(async () => {

    let price = await getVESPrice();

    console.log(`one BTC equals ${price} VES on localbitcoins.com`);

  });

program
  .parse(process.argv);

