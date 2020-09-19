#!/usr/bin/env ts-node

require('dotenv').config();

const program = require('commander')

import { getPriceOfOneDollarInVES } from '../lib/prices/ves';
import { log } from '../lib';
import { getVESPrice } from '../lib/localbitcoins';
import { createConversion, updateCryptoUSDPrice, updateUSDPrices, updateDashPrices } from '../lib/prices';

import { updateCryptoUSDPrices } from '../lib/prices/crypto';

program
  .command('seed_prices')
  .action(async () => { 
    try {

      log.info('updating USD prices');

      await updateUSDPrices();

      log.info('updating crypto prices');

      await updateCryptoUSDPrices();

      log.info('updated crypto prices');

    } catch(error) {

      console.error(error.message);

    }

  });

program
  .command('update_crypto_prices')
  .action(async () => {

    try {
      await updateDashPrices();

      log.info('updating crypto prices');

      await updateCryptoUSDPrices();

      log.info('updated crypto prices');

    } catch(error) {

      console.error(error.message);

    }

    process.exit(0);

  });

program
  .command('update_usd')
  .action(async () => {

    try {

      log.info('updating usd prices');

      await updateUSDPrices();

      log.info('updated usd prices');

    } catch(error) {

      console.error(error.message);

    }

    process.exit(0);

  });

program
  .command('update_crypto_usd <currency>')
  .action(async (currency) => {

    try {

      log.info('updating crypto usd price', currency);

      await updateCryptoUSDPrice(currency);

      log.info('updated crypto usd price', currency);

    } catch(error) {

      console.error(error.message);

    }

    process.exit(0);

  });

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

