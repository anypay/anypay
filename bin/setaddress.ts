#!/usr/bin/env ts-node

require('dotenv').config();

import * as models from '../lib/models';
import {setAddress} from '../lib/core';

const argv = require('yargs').argv;

(async function() {

  if (!argv.email) {

    console.log('--email must be provided');

    process.exit(0);

  }

  if (!argv.currency) {

    console.log('--currency must be provided');

    process.exit(0);

  }

  if (!argv.address) {

    console.log('--address must be provided');

    process.exit(0);

  }

  let account = await models.Account.findOne({ where: { email: argv.email }});

  console.log('account found', account);

  await setAddress({
    currency: argv.currency,
    address: argv.address,
    account_id: account.id
  });

  account = await models.Account.findOne({ where: { email: argv.email }});

  console.log(account.toJSON());

})();
