#!/usr/bin/env ts-node

require('dotenv').config();

import { models, log, accounts } from '../lib';
import { Op } from 'sequelize'
import { getSupportedCoins, near } from '../lib/accounts';
import { registerAccount, setPositionFromLatLng } from '../lib/accounts';
import { setAddress } from '../lib/core';

var program = require("commander");

program
  .command('near [limit]')
  .action(async (limit=25) => {

    let latitude = 43.0718 
    let longitude = -70.7626

    try {

      let accounts = await near(latitude, longitude, limit)

      for (let account of accounts) {
        console.log(account.email, account.business_name)
      }
    } catch(error) {

      console.log(error) 
    }


    process.exit(0)
  
  })


program
  .command('setpositions')
  .action(async () => {

    let accounts = await models.Account.findAll({ where: {
      latitude: {
        [Op.ne]: null
      },
      position: {
        [Op.eq]: null
      }
    }})

    for (let account of accounts) {

      let result = await setPositionFromLatLng(account)

      console.log(result)

    }

    process.exit(0)

  })

program
  .command('listcoins <email>')
  .action(async (email) => {

    let account = await models.Account.findOne({ where: { email }});

    let coins = await getSupportedCoins(account.id); 

    console.log(coins);

  });

program
  .command('afterregistered <email>')
  .action(async (email) => {

    let account = await models.Account.findOne({ where: { email }});

    log.debug('account', account.toJSON())

  });


program
  .command('update <email> <attribute> <value>')
  .action(async (email, attr, value) => {

    try {

      let account = await accounts.findByEmail(email)

      let params = {}

      params[attr] = value;

      account = await accounts.updateAccount(account, params)

      console.log(account.toJSON());

    } catch(error) {

      console.log(error);

      process.exit(0);
  
    }

  });



program
  .command('addtag <email> <tag>')
  .action(async (email, tag) => {
    try {

      let account = await models.Account.findOne({ where: { email }});

      let [isNew] = await models.AccountTag.findOrCreate({
        where: {
          account_id: account.id,
          tag
        },
        defaults: {
          account_id: account.id,
          tag
        }
      });

      if (isNew) {

        console.log(`${email} tagged as "${tag}"`);

      } else {

        console.log(`${email} already tagged as "${tag}"`);

      }

    } catch(error) {
      
      console.error(error.message);

    }

    process.exit(0);

  });

program
  .command('removetag <email> <tag>')
  .action(async (email, tag) => {
    try {

      let account = await models.Account.findOne({ where: { email }});

      let record = await models.AccountTag.findOne({ where: {

        account_id: account.id,

        tag

      }});

      await record.destroy();

    } catch(error) {
      
      console.error(error.message);

    }

    process.exit(0);

  });


program
  .command('getaccount <email>')
  .action(async (email) => {

    let account = await models.Account.findOne({ where: { email }});

    if (!account) {

      log.info(`account not found for email ${email}`);

    } else {

      log.info(`account found`, account.toJSON());

    }

    process.exit();
 
  });

program
  .command('setaddress <email> <currency> <address>')
  .action(async (email, currency, address) => {

    let account = await models.Account.findOne({ where: { email }});

    await setAddress({

      account_id: account.id,

      currency,

      address

    });

    console.log(`${currency} address set to ${address} for ${email}`);

    process.exit();

  });

program
  .command('getaddress <email> <currency>')
  .action(async (email, currency) => {

    let account = await models.Account.findOne({ where: { email }});

    let accountCoins = await getSupportedCoins(account.id);

    log.info(accountCoins[currency]);

    process.exit(0);

  });

program
  .command('register <email> <password>')
  .action(async (email, password) => {

    let account = await registerAccount(email, password);

    log.info(account.toJSON());

    process.exit(0);

  });

program
  .command('setname <email> <name>')
  .action(async (email, name) => {

    let account = await accounts.setName(email, name);

    log.info(account.toJSON());

    process.exit(0);

  });


program
  .command('setphysicaladdress <email> <address>')
  .action(async (email, address) => {

    let account = await accounts.setPhysicalAddress(email, address);

    log.info(account.toJSON());

    process.exit(0);

  });


program.parse(process.argv);

