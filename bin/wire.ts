#!/usr/bin/env ts-node

require('dotenv').config();

import * as program from 'commander';

import * as moment from 'moment';

import * as models from '../lib/models';

import { Op } from 'sequelize';

import { sendEmail } from '../lib/email';

import { buildWireEmailReport } from '../lib/wire';

export async function getReportForDay(day: string, email: string) {

  let start = moment(day).startOf('day');

  let end = moment(day).startOf('day').add(1, 'day');

  let account = await models.Account.findOne({ where: { email }});

  if (!account) {

    console.error(`no account found for email ${email}`); 

    process.exit(0);

  }

  let payments = await models.Invoice.findAll({

    where: {

      account_id: account.id,

      complete: true,

      completed_at: {

        [Op.gte]: start.toDate(),

        [Op.lt]: end.toDate()

      }

    }

  })

  let sum = payments.reduce((agg, payment) => {

    agg += payment.denomination_amount_paid;

  }, 0);

  return {

    payments,

    sum

  }

}

program
  .command('reportforday <day> [email]')
  .action(async (day, email = 'dashsupport@egifter.com') => {

    let report = await getReportForDay(day, email);

    console.log(report);

    await sendEmail('steven@anypay.global', `wire report for ${day}`, JSON.stringify(report));

    console.log('email sent');

    await sendEmail('derrick@anypay.global', `wire report for ${day}`, JSON.stringify(report));

    console.log('email sent');

    process.exit(0);

  });

program
  .command('reportsinceinvoice <uid>')
  .action(async (invoiceUID) => {

    let content = await buildWireEmailReport(invoiceUID);

    console.log('content', content);

    process.exit(0);

  });

program
  .command('reportforyesterday [email]')
  .action(async (email = 'dashsupport@egifter.com') => {

    let day = moment().startOf('day').subtract(1, 'days').format();

    let report = await getReportForDay(day, email);

    console.log(report);

    await sendEmail('steven@anypay.global', `wire report for ${day}`, JSON.stringify(report));

    console.log('email sent');

    await sendEmail('derrick@anypay.global', `wire report for ${day}`, JSON.stringify(report));

    console.log('email sent');

    process.exit(0);

  });

program.parse(process.argv);

