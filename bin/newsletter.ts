#!/usr/bin/env ts-node

require('dotenv').config();

import * as EmailValidator from 'email-validator';

import * as program from 'commander';

import { generateInvoice } from '../lib/invoice';

import { log, models } from '../lib';

import { invoicePaidEmail } from '../lib/email';

import { email } from 'rabbi';

import { Op } from 'sequelize';

async function deliverNewsletter(newsletter, account) {

  let [delivery] = await models.EmailDelivery.findOrCreate({
    where: {
      account_id: account.id,
      email_id: newsletter.id
    },

    defaults: {
      account_id: account.id,
      email_id: newsletter.id
    }
  })

  if (delivery.uid) {
    console.log('email already delivered');
    return delivery;
  }

  let resp = await email.sendEmail(
    newsletter.name,
    account.email,
    'newsletter@anypayinc.com'
  );

  delivery.uid = resp.MessageId;

  await delivery.save();

  delivery = await models.EmailDelivery.findOne({ where: { id: delivery.id }});

  return delivery;
}

program
  .command('sendsingle <name> <email>')
  .action(async (name, email) => {

    let [newsletter] = await models.Email.findOrCreate({
      where: {
        name
      },
      defaults: {
        name
      }
    });

    let account = await models.Account.findOne({ where: {
      email
    }});

    let delivery = await deliverNewsletter(newsletter, account);

    console.log(delivery.toJSON());

    process.exit(0);

  });

program
  .command('sendnewsletter <name>')
  .action(async (name) => {

    let [newsletter] = await models.Email.findOrCreate({
      where: {
        name
      },
      defaults: {
        name
      }
    });

    console.log(newsletter);

    try {

      let accounts = await models.Account.findAll({ where: {
        email: {
          [Op.ne]: null
        }
      }});

      accounts = accounts
        .filter(account => EmailValidator.validate(account.email))

      for (let i=0; i<accounts.length; i++) {

        let account = accounts[i];

        let delivery = await deliverNewsletter(newsletter, account);

        console.log(delivery.toJSON());

      }
 

    } catch(error) {

      console.log(error);
    }

    process.exit(0);

  });

program.parse(process.argv);

