#!/usr/bin/env node

const password = require('../lib/password');
const program = require('commander');

program
  .version('0.1.0')
  .command('sendpasswordreset <email>')
  .action(async function(email, newPassword) {

    try {

      await password.sendPasswordResetEmail(email);

      console.log('password reset email sent successfully!');

    } catch(e) {
      console.log("error", e.message);
    }

  });

program.parse(process.argv);

