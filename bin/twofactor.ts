#!/usr/bin/env ts-node

import * as program from 'commander';

import * as qrcode from 'qrcode-terminal';

import { twofactor } from '../lib';

program
  .command('getsecret <email>')
  .action(async (email) => {

    let secret = await twofactor.getAccountSecret(email);

    let url = twofactor.buildAutheneticatorURL(email, secret);

    console.log(url);

    qrcode.generate(url, {small: true});

    process.exit(0);

  });

program
  .command('verifytoken <email> <token>')
  .action(async (email, token) => {

    let verified = await twofactor.verifyAccountToken(email, token);

    console.log('is verified?', verified);

    process.exit(0);

  });

program
  .command('deletesecret <email> <token>')
  .action(async (email, token) => {

    let verified = await twofactor.deleteAccountSecret(email, token);  

    console.log('is verified and deleted?', verified);

    process.exit(0);

  });

program.parse(process.argv);
