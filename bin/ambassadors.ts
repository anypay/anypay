#!/usr/bin/env ts-node

require('dotenv').config();

var program = require('commander');
var Table = require('cli-table');

import {
  listAll,
  register,
  claimBusiness
} from '../lib/ambassadors';

import { models } from '../lib';

function renderTable() {

}

program
  .command('migrate')
  .action(async () => {

    let rewards = await models.AmbassadorReward.findAll({ where: {

      account_id: null

    }});

    console.log('rewards', rewards.length);

    for (let i =0; i < rewards.length; i++) {

      let invoice = await models.Invoice.findOne({ where: {

        uid: rewards[i].invoice_uid

      }});

      let ambassador = await models.Ambassador.findOne({ where: {

        id: rewards[i].ambassador_id

      }});

      rewards[i].account_id = invoice.account_id;
      rewards[i].ambassador_account_id = ambassador.account_id;

      await rewards[i].save();

      console.log(rewards[i].toJSON());

    }

    process.exit(0);

  });

program
  .command('register <email> [name]')
  .action(async (email, name) => {

    let ambassador = await register(email, name);

    console.log(ambassador.toJSON());

    process.exit(0);

  });

program
  .command('claimbusiness <ambassador_email> <merchant_email>')
  .action(async (ambassadorEmail, merchantEmail) => {

    let claim = await claimBusiness(ambassadorEmail, merchantEmail);

    console.log(claim);

    process.exit(0);

  });

program
  .command('listall')
  .action(async () => {

    var ambassadors;

    try {

      ambassadors = await listAll();

    } catch(error) {

      console.error(error.message);

    }

    var table = new Table({
      head: ['ID', 'Account ID', 'Name']
    });
    
    if (!ambassadors) {

      console.log('no ambassadors');

      process.exit();
    }

    for (let i=0; i<ambassadors.length; i++) {

      let ambassador = ambassadors[i];

      table.push([
        ambassador.id,
        ambassador.account_id,
        ambassador.name
      ]);

    }

    console.log(table.toString());

    process.exit(0);

  });

program.parse(process.argv);

