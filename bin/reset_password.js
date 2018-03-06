#!/usr/bin/env node

const password = require('../lib/password');
const program = require('commander');

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

