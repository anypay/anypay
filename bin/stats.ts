#!/usr/bin/env ts-node
require('dotenv').config();

const program = require('commander');

const database = require('../lib/database');

program
  .command('merchant_dash_back <month> <year>')
  .action(async (month, year) => {

    month = parseInt(month);

    year = parseInt(year);

    let startDate = `${month}-01-${year}`;

    var endDate;

    if (month === '12') {

      endDate = `01-01-${year+1}`; 

    } else {

      endDate = `${month+1}-01-${year}`;

    }

    const query =  `select sum(amount) from dash_back_merchant_payments where "createdAt" >= '${startDate}' and "createdAt" < '${endDate}'`

    console.log('query', query);

    let result = await database.query(query);

    console.log(`total dash back paid to merchants during ${startDate} to ${endDate}: ${result[0][0].sum}`);

    process.exit(0); 

  });

program
  .command('customer_dash_back <month> <year>')
  .action(async (month, year) => {

    month = parseInt(month);

    year = parseInt(year);

    let startDate = `${month}-01-${year}`;

    var endDate;

    if (month === '12') {

      endDate = `01-01-${year+1}`; 

    } else {

      endDate = `${month+1}-01-${year}`;

    }

    const query =  `select sum(amount) from dash_back_customer_payments where "createdAt" >= '${startDate}' and "createdAt" < '${endDate}'`

    console.log('query', query);

    let result = await database.query(query);

    console.log(`total dash back paid to merchants during ${startDate} to ${endDate}: ${result[0][0].sum}`);

    process.exit(0); 

  });

program
  .command('total_accounts')
  .action(async () => {

    let result = await database.query('select count(*) from accounts');

    console.log(`\n\ntotal accounts: ${result[0][0].count}\n\n`);

    process.exit(0);

  });

program
  .command('total_dash_accounts')
  .action(async () => {

    let result = await database.query('select count(*) from accounts where dash_payout_address is not null');

    console.log(`\n\ntotal dash accounts: ${result[0][0].count}\n\n`);

    process.exit(0);

  });

program.parse(process.argv);

