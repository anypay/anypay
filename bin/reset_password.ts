#!/usr/bin/env ts-node

require('dotenv').config();

import * as password from '../lib/password';
import { Command } from 'commander';
const program = new Command();


program
  .version('0.1.0')
  .command('resetpassword <email> <password>')
  .action(async function(email, newPassword) {

    try {

      await password.resetPasswordByEmail(email, newPassword);

      console.log('password reset successfully!');

    } catch(e) {
      console.log("error", e.message);
    }

  });

program
  .command('send-email <email>')
  .action(async function(email) {

    try {

      await password.sendPasswordResetEmail(email);

      console.log('password reset successfully!');

    } catch(e) {
      console.log("error", e.message);
    }

  });



program.parse(process.argv);

