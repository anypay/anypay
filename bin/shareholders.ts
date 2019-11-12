#!/usr/bin/env ts-node

import * as program from 'commander';

import { models, log } from '../lib';

program
  .command('seedshareholders')
  .action(async () => {

    let shareholders = require('../config/shareholders.json').shareholders;

    await Promise.all(

      shareholders.map(async shareholder => {

        let account = await models.Account.findOne({ where: {

          email: shareholder.email

        }});

        let [record, isNew] = await models.Shareholder.findOrCreate({

          where: {

            account_id: account.id
          },

          defaults: {

            name: shareholder.name,

            account_id: account.id,

            rvn_address: shareholder.rvn_address

          }

        });

        if (!isNew) {

          log.info(`shareholder for ${shareholder.email} already recorded`)

        } else {

          log.info(`shareholder recorded for ${shareholder.email}`);

        }

      })

    );

  });

program
  .command('adddocument <email> <url> <document_name>')
  .action(async (email, url, name) => {

    let account = await models.Account.findOne({ where: {

      email

    }});

    let shareholder = await models.Shareholder.findOne({ where: {

      account_id: account.id

    }});

    let document = await models.ShareholderDocument.create({

      name,
      url,
      shareholder_id: shareholder.id

    });

    console.log(document.toJSON());

    process.exit(0);

  })

program
  .parse(process.argv);
