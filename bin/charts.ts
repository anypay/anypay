#!/usr/bin/env ts-node

require('dotenv').config();

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

program
  .command('accountscreatedbyweek')
  .action(async () => {
    let response = await database.query(`
      select date_trunc('week', "createdAt") as week,
      count(1)
      from accounts
      group by 1
      order by week asc;
    `);

    let dates = response[0];

    var s0 = new Array(dates.length);

    for (var i = 0; i < dates.length; i++) {

        s0[i] = dates[i].count;

    }

    console.log (asciichart.plot (s0, { height: 30 }))

  });

program
  .command('addressesaddedbyweek')
  .action(async () => {
    let response = await database.query(`
      select date_trunc('week', "createdAt") as week,
      count(1)
      from addresses
      group by 1
      order by week asc;
    `);

    let dates = response[0];

    var s0 = new Array(dates.length);

    for (var i = 0; i < dates.length; i++) {

        s0[i] = dates[i].count;

    }

    console.log (asciichart.plot (s0, { height: 30 }))

  });

program
  .command('dashaccountsbyweek')
  .action(async () => {
    let response = await database.query(`
      select date_trunc('week', "createdAt") as week,
      count(1)
      from accounts
      where dash_payout_address is not null
      group by 1
      order by week asc;
    `);

    let dates = response[0];

    var s0 = new Array(dates.length);

    for (var i = 0; i < dates.length; i++) {

        s0[i] = dates[i].count;

    }

    console.log (asciichart.plot (s0, { height: 30 }))

  });

program
  .command('bchaccountsbyweek')
  .action(async () => {
    let response = await database.query(`
      select date_trunc('week', "createdAt") as week,
      count(1)
      from accounts
      where bitcoin_cash_address is not null
      group by 1
      order by week asc;
    `);

    let dates = response[0];

    var s0 = new Array(dates.length);

    for (var i = 0; i < dates.length; i++) {

        s0[i] = dates[i].count;

    }

    console.log (asciichart.plot (s0, { height: 30 }))

  });

program
  .command('zenaccountsbyweek')
  .action(async () => {
    let response = await database.query(`
      select date_trunc('week', "createdAt") as week,
      count(1)
      from addresses
      where currency = 'ZEN'
      group by 1
      order by week asc;
    `);

    let dates = response[0];

    var s0 = new Array(dates.length);

    for (var i = 0; i < dates.length; i++) {

        s0[i] = dates[i].count;

    }

    console.log (asciichart.plot (s0, { height: 30 }))

  });

program
  .command('sumpaidinvoicesbyweek')
  .action(async () => {
    let response = await database.query(`
      with data as (
        select date_trunc('week', "createdAt") as day,
        count(1)
        from invoices

        where status = 'paid'

        group by 1
        order by day desc
      )

    select
      day,
      sum(count) over (order by day asc rows between unbounded preceding and current row)
    from data;
    `);

    let dates = response[0];

    var s0 = new Array(dates.length);

    for (var i = 0; i < dates.length; i++) {

        s0[i] = dates[i].sum;

    }

    console.log (asciichart.plot (s0, { height: 30 }))

  });

program
  .command('sumtotalinvoicesbyweek')
  .action(async () => {
    let response = await database.query(`
      with data as (
        select date_trunc('week', "createdAt") as day,
        count(1)
        from invoices

        group by 1
        order by day desc
      )

    select
      day,
      sum(count) over (order by day asc rows between unbounded preceding and current row)
    from data;
    `);

    let dates = response[0];

    var s0 = new Array(dates.length);

    for (var i = 0; i < dates.length; i++) {

        s0[i] = dates[i].sum;

    }

    console.log (asciichart.plot (s0, { height: 30 }))

  });

program
  .command('sumdashinvoicesbyweek')
  .action(async () => {
    let response = await database.query(`
      with data as (
        select date_trunc('week', "createdAt") as day,
        count(1)
        from invoices
        where currency = 'DASH'

        group by 1
        order by day desc
      )

    select
      day,
      sum(count) over (order by day asc rows between unbounded preceding and current row)
    from data;
    `);

    let dates = response[0];

    var s0 = new Array(dates.length);

    for (var i = 0; i < dates.length; i++) {

        s0[i] = dates[i].sum;

    }

    console.log (asciichart.plot (s0, { height: 30 }))

  });

program
  .command('sumaccountsbyweek')
  .action(async () => {
    let response = await database.query(`
      with data as (
        select date_trunc('week', "createdAt") as day,
        count(1)
        from accounts

        group by 1
        order by day desc
      )

    select
      day,
      sum(count) over (order by day asc rows between unbounded preceding and current row)
    from data;
    `);

    let dates = response[0];

    var s0 = new Array(dates.length);

    for (var i = 0; i < dates.length; i++) {

        s0[i] = dates[i].sum;

    }

    console.log (asciichart.plot (s0, { height: 30 }))

  });

program
  .command('sumdashaccountsbyweek')
  .action(async () => {
    let response = await database.query(`
      with data as (
        select date_trunc('week', "createdAt") as day,
        count(1)
        from accounts
        where dash_payout_address is not null

        group by 1
        order by day desc
      )

    select
      day,
      sum(count) over (order by day asc rows between unbounded preceding and current row)
    from data;
    `);

    let dates = response[0];

    var s0 = new Array(dates.length);

    for (var i = 0; i < dates.length; i++) {

        s0[i] = dates[i].sum;

    }

    console.log (asciichart.plot (s0, { height: 30 }))

  });


program.parse(process.argv);

