#!/usr/bin/env node

require("dotenv").config();
var amqp = require('amqplib');
var database = require('../lib/database');

const payrollQuery = `SELECT
   accounts.email, accounts.dash_payout_address, payroll_accounts.*
  FROM payroll_accounts
  join accounts
    on accounts.id = payroll_accounts.account_id LIMIT 100;`;

(async function() {

  var conn = await amqp.connect(process.env.AMQP_URL);

  console.log('amqp.connected');

  let chan = await conn.createChannel();

  console.log('amqp.channel.created');

  await chan.assertExchange('anypay.payroll');

  console.log('amqp.exchange.asserted', 'anypay.payroll');

  let payroll = (await database.query(payrollQuery))[0];

  payroll.forEach(async account => {

    const DAYS_PER_MONTH = 30.4167

    account.base_monthly_amount = parseFloat(account.base_monthly_amount);

    account.base_daily_amount = account.base_monthly_amount / DAYS_PER_MONTH;

    let message = new Buffer(JSON.stringify(account));

    await chan.publish('anypay.payroll', 'daily', message);

    console.log('amqp.published', account);

  });

  setTimeout(() => conn.close(), 5000);

})();

