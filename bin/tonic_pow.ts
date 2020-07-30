#!/usr/bin/env ts-node

import * as TonicPow from '../lib/tonic_pow';
import { models, log, accounts } from '../lib';

import * as program from 'commander';

program
  .command('get_campaign <email>')
  .action(async (email) => {

    try {

      let account = await models.Account.findOne({ where: { email }});

      let campaign = TonicPow.getCampaign(account)

      console.log(campaign);

    } catch(error) {

      log.error(error);

    }

    process.exit(0);

  });

program
  .command('set_campaign <email>')
  .action(async (email) => {

    try {

      let account = await models.Account.findOne({ where: { email }});

      let campaign = await TonicPow.setCampaign(account);

      console.log(campaign);

    } catch(error) {

      log.error(error);

    }

    process.exit(0);

  });

program
  .parse(process.argv);

