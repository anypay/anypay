#!/usr/bin/env ts-node

import * as program from 'commander';

import * as http from 'superagent';

require('dotenv').config();

var Mailchimp = require('mailchimp-api-v3')

program
  .command('register <email>')
  .action(async (email) => {

    let apiKey = process.env.MAILCHIMP_API_KEY;

    var mailchimp = new Mailchimp(apiKey);

    try {

      let resp = await mailchimp.post({
        path: '/lists/7bd4603ab9/members',
        body: {
          email_address: email,
          status: 'subscribed'
        }
      });

    } catch(error) {

      console.log(error);

    }

  });

program
  .command('getlists')
  .action(async (email) => {

    let apiKey = process.env.MAILCHIMP_API_KEY;

    var mailchimp = new Mailchimp(apiKey);

    let resp = await mailchimp.get({
      path: '/lists'
    });

    console.log(resp);

  });

program.parse(process.argv);

