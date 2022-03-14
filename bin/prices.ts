#!/usr/bin/env ts-node

require('dotenv').config();

const program = require('commander')

import { log } from '../lib/log';

import { getCryptoPrices, updateCryptoUSDPrices, createConversion, updateCryptoUSDPrice, updateUSDPrices } from '../lib/prices';

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
  .command('getcmcprices')
  .action(async () => {

    try {

      let prices = await getCryptoPrices('USD');

      console.log(prices);

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
  .parse(process.argv);

