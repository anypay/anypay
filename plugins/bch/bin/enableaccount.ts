#!/usr/bin/env ts-node

require('dotenv').config();

const program = require('commander');

import * as models from '../../../lib/models';

program
  .command('enable <email>')
  .action(async (email) => {

    await models.Account.update({

      bitcoin_cash_enabled: true
    
    }, { where: {

      email: email

    }});

    process.exit(0);

  });


program
  .command('disable <email>')
  .action(async (email) => {

    await models.Account.update({

      bitcoin_cash_enabled: false
    
    }, { where: {

      email: email

    }});

    process.exit(0);

  });

program.parse(process.argv);

