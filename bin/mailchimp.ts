#!/usr/bin/env ts-node

require('dotenv').config();

import * as program from 'commander';

import * as http from 'superagent';

import { models, log } from '../lib';

var Mailchimp = require('mailchimp-api-v3')

async function subscribe(email) {

  let apiKey = process.env.MAILCHIMP_API_KEY;

  var mailchimp = new Mailchimp(process.env.MAILCHIMP_API_KEY);

  let resp = await mailchimp.post({
    path: '/lists/7bd4603ab9/members',
    body: {
      email_address: email,
      status: 'subscribed'
    }
  });

  return resp;

}

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

program
  .command('subscribeall')
  .action(async () => {

    let apiKey = process.env.MAILCHIMP_API_KEY;

    var mailchimp = new Mailchimp(apiKey);

    let accounts = await models.Account.findAll();

    for (let i=0; i < accounts.length; i++) {

      let account = accounts[i];

      try {

        await subscribe(account.email);

        log.info(`mailchimp.subscribed`, account.email);

      } catch(error) {

        log.error(error.message);

      }

    }


  });

program.parse(process.argv);

