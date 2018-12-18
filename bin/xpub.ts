#!/usr/bin/env ts-node

require('dotenv').config();

var program = require('commander');
const Util = require("../lib/dash/extended_public_key_util");

import {log, models} from '../lib';

import * as xpublib from '../lib/xpub/index';

program
  .command('randomxpub <currency>')
  .action(async (currency) => {

    let xpub = xpublib.randomXpubKey(currency);

    console.log(xpub);

    process.exit(0);

  });

program
  .command('generateaddress <currency> <xpubkey> <nonce>')
  .action(async (currency, xpubkey, nonce) => {

    let address = xpublib.generateAddress(currency, xpubkey, nonce);

    console.log(address);

    process.exit(0);

  });


program
  .command('setkey <email> <xpub>')
  .action(async (email, xpub) => {

    let account = await models.Account.findOne({ where: { email }});

    let xpubkey = await models.ExtendedPublicKey.findOne({ where: {

      account_id: account.id

    }});

    if (xpubkey) {

      console.log('xpubkey already set');

      return;

    }

    xpubkey = await models.ExtendedPublicKey.create({

      account_id: account.id,

      nonce: 0,

      xpubkey: xpub

    })

    console.log('xpubkey set', xpubkey.toJSON())
    

  });

program
  .command('getnewaddress <email> <currency>')
  .action(async (email, currency) => {

    let account = await models.Account.findOne({ where: { email }});

    if (!account) {

      throw new Error(`account with email ${email} not found`);
  
    }

    let xpubkey = await models.ExtendedPublicKey.findOne({ where: {

      account_id: account.id,

      currency

    }});

    if (!xpubkey) {

      throw new Error('no xpubkey for account');

    }

    let address = xpublib.generateAddress(currency, xpubkey.xpubkey, xpubkey.nonce);

    xpubkey.nonce = xpubkey.nonce + 1;

    await xpubkey.save();

    console.log(address);

  });

program.parse(process.argv);

