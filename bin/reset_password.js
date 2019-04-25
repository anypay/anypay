#!/usr/bin/env ts-node

require('dotenv').config();

import * as password from '../lib/password';
import * as program from 'commander';

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

program.parse(process.argv);

