#!/usr/bin/env node

const DashPayout = require("../lib/models/dash_payout");
const DashPayoutService = require("../servers/dash_payouts/lib");

let accountId = process.argv[2];

console.log(`Create payout for account ${accountId}`);

DashPayoutService.createPayout(accountId)
  .then(payout => {
    console.log(`Created payout for account ${accountId}`, payout);
  })
  .catch(error => {
    console.error(`error creating payout for account ${accountId}`);
  });
