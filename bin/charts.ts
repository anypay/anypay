#!/usr/bin/env ts-node

var asciichart = require ('asciichart')

import * as database from '../lib/database';

let program = require("commander");

program
  .command('paidinvoicesbyweek')
  .action(async () => {
    let response = await database.query(`
      select date_trunc('week', "createdAt") as day,
      count(1)
      from invoices
      where status = 'paid'
      group by 1
      order by day asc;
    `);

    let dates = response[0];

    var s0 = new Array(dates.length);

    for (var i = 0; i < dates.length; i++) {

        s0[i] = dates[i].count;

    }

    console.log (asciichart.plot (s0, { height: 30 }))

  });

program
  .command('totalinvoicesbyweek')
  .action(async () => {
    let response = await database.query(`
      select date_trunc('week', "createdAt") as day,
      count(1)
      from invoices
      group by 1
      order by day asc;
    `);

    let dates = response[0];

    var s0 = new Array(dates.length);

    for (var i = 0; i < dates.length; i++) {

        s0[i] = dates[i].count;

    }

    console.log (asciichart.plot (s0, { height: 30 }))

  });

program
  .command('unpaidinvoicesbyweek')
  .action(async () => {
    let response = await database.query(`
      select date_trunc('week', "createdAt") as day,
      count(1)
      from invoices
      where status = 'unpaid'
      group by 1
      order by day asc;
    `);

    let dates = response[0];

    var s0 = new Array(dates.length);

    for (var i = 0; i < dates.length; i++) {

        s0[i] = dates[i].count;

    }

    console.log (asciichart.plot (s0, { height: 30 }))

  });

program
  .command('paidinvoicesbyday')
  .action(async () => {
    let response = await database.query(`
      select date_trunc('day', "createdAt") as day,
      count(1)
      from invoices
      where status = 'paid'
      group by 1
      order by day asc;
    `);

    let dates = response[0];

    var s0 = new Array(dates.length);

    for (var i = 0; i < dates.length; i++) {

        s0[i] = dates[i].count;

    }

    console.log (asciichart.plot (s0, { height: 30 }))

  });

program
  .command('paidinvoicesbymonth')
  .action(async () => {
    let response = await database.query(`
      select date_trunc('month', "createdAt") as day,
      count(1)
      from invoices
      where status = 'paid'
      group by 1
      order by day asc;
    `);

    let dates = response[0];

    var s0 = new Array(dates.length);

    for (var i = 0; i < dates.length; i++) {

        s0[i] = dates[i].count;

    }

    console.log (asciichart.plot (s0, { height: 30 }))

  });

program.parse(process.argv);

