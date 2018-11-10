#!/usr/bin/env ts-node

require('dotenv').config();

var program = require('commander');
const Util = require("../lib/dash/extended_public_key_util");

import {models} from '../lib';

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
  .command('getnewaddress <email>')
  .action(async (email) => {

    let account = await models.Account.findOne({ where: { email }});

    if (!account) {

      throw new Error(`account with email ${email} not found`);
  
    }

    let xpubkey = await models.ExtendedPublicKey.findOne({ where: {

      account_id: account.id

    }});

    if (!xpubkey) {

      throw new Error('no xpubkey for account');

    }

    let address = Util.generate(xpubkey.xpubkey, `m/0/${xpubkey.nonce}`);

    xpubkey.nonce = xpubkey.nonce + 1;

    await xpubkey.save();

    console.log(address);

  });

program.parse(process.argv);

