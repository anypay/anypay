#!/usr/bin/env ts-node

require('dotenv').config();

var dashwatch = require('commander');

import * as moment from 'moment';

import * as http from 'superagent';
import {database} from '../lib';

var startDate,
    startDateFormatted,
    endDate,
    endDateFormatted

dashwatch
  .command('reportformonth <startdate>')
  .action(async (startdate) => {

    startDateFormatted = startdate;

    startDate = moment(startdate);

    endDate = startDate.add(30, 'days');

    endDateFormatted = endDate.format('MM-DD-YYYY');

    var numDashbackTxns,
        totalCustomerDashback,
        totalMerchantDashback,
        anypayUptime,
        totalDashAccounts,
        totalVerifiedMerchants,
        numMonthlyTxnsAllCrypto,
        numMonthlyTxnsDash;

    anypayUptime = await getUptime();
    totalDashAccounts = await getTotalDashAccounts();
    totalVerifiedMerchants = await getTotalVerifiedMerchants();
    numMonthlyTxnsDash = await countMonthlyTransactionsDash(
      startDateFormatted,
      endDateFormatted
    );
    numMonthlyTxnsAllCrypto = await countMonthlyTransactionsAllCrypto(
      startDateFormatted,
      endDateFormatted
    );

    let report = {

      anypay_general_kpis: {

        uptime: anypayUptime,

        total_dash_accounts: totalDashAccounts,

        total_verified_merchants: totalVerifiedMerchants

      },

      anypay_transaction_kpis: {

        monthly_transactions_all_crypto: numMonthlyTxnsAllCrypto,

        monthly_transactions_dash: numMonthlyTxnsDash

      },

      dashback_kpis: {

        number_cashback_transactions: await
        sumDashBackTransactions(startDateFormatted, endDateFormatted),

        total_paid_to_customers: await sumCustomersDashBackPaid(startDateFormatted, endDateFormatted),

        total_paid_to_merchants: await sumMerchantsDashBackPaid(startDateFormatted, endDateFormatted)

      }

    }

    console.log(report);

  });

dashwatch.parse(process.argv);


async function getUptime() {

  let url = `https://api.uptimerobot.com/v2/getMonitors`;

  let resp = await http.post(url).send({

    api_key: process.env.UPTIMEROBOT_API_KEY,

    custom_uptime_ratios: '30'

  });

  var minimumUptime = 100;

  return resp.body.monitors.map(monitor => {

    return parseFloat(monitor.custom_uptime_ratio);

  }).reduce((minimum, uptime) => {

    if (uptime < minimum) {
      return uptime;
    } else {
      return minimum;
    }
  
  }, 100);

}

async function getTotalDashAccounts() {

  let resp = await database.query(`select count(*) from accounts where
  dash_payout_address is not null and "createdAt" < '${endDateFormatted}'`);

  return parseInt(resp[0][0].count);

}

async function getTotalVerifiedMerchants() {

  let resp = await database.query(`select count(*) from accounts where
  physical_address is not null and "createdAt" < '${endDateFormatted}'`);

  return parseInt(resp[0][0].count);

}

async function countMonthlyTransactionsAllCrypto(start, end) {

  let resp = await database.query(`select count(*) from invoices where status = 'paid'
  and "createdAt" > '${start}' and "createdAt" <
  '${end}'`);

  return parseInt(resp[0][0].count);

}

async function countMonthlyTransactionsDash(start, end) {

  let resp = await database.query(`select count(*) from invoices where status = 'paid'
  and "createdAt" > '${start}' and "createdAt" <
  '${end}' and currency = 'DASH'`);

  return parseInt(resp[0][0].count);

}

async function sumMerchantsDashBackPaid(start, end) {

  let merchantsResp = await database.query(`select sum(amount) from
  dash_back_merchant_payments where "createdAt" > '${start}' and "createdAt" <
  '${end}'`);

  return parseFloat(merchantsResp[0][0].sum);
}

async function sumCustomersDashBackPaid(start, end) {

  let customersResp = await database.query(`select sum(amount) from
  dash_back_customer_payments where "createdAt" > '${start}' and "createdAt" <
  '${end}'`);

  return parseFloat(customersResp[0][0].sum);

}

async function sumDashBackTransactions(start, end) {

  let customersResp = await database.query(`select count(*) from
  dash_back_customer_payments where "createdAt" > '${start}' and "createdAt" <
  '${end}'`);

  let merchantResp = await database.query(`select count(*) from
  dash_back_merchant_payments where "createdAt" > '${start}' and "createdAt" <
  '${end}'`);

  let numCustomerPayments = parseInt(customersResp[0][0].count);
  let numMerchantPayments = parseInt(merchantResp[0][0].count);

  return (numCustomerPayments > numMerchantPayments ? numCustomerPayments :
  numMerchantPayments);

}

