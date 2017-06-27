
const BluebirdPromise = require('bluebird');
const DashPayoutService = require('./lib');
const Account = require('../../lib/models/account');
const database = require('../../lib/database');

const EVERY_DAY = '0 0 0 * * *';
const EVERY_FIVE_SECONDS = '*/5 * * * * *';

var CronJob = require('cron').CronJob;
new CronJob(EVERY_FIVE_SECONDS, function() {

  // find all accounts with payout addresses

  // for each account create a payout

  // push payout into dash_payouts message queue

  database.sync().then(() => {

    Account.findAll({
      where: {
        dash_payout_address: {
          $ne: null
        } 
      }
    })
    .then(accounts => {

      console.log(`found ${accounts.length} accounts`);
      console.log(JSON.stringify(accounts));

      // create a new payout for each account one at a time
      return BluebirdPromise.resolve(accounts).map(account => {
        return DashPayoutService.createPayout(account.id);
      }, { concurrency: 1 });
    })
    .then(result => {

      let payouts = result.filter(payout => {
        return typeof payout !== 'undefined';
      })

      console.log(`${payouts.length} payouts created`);
    })
    .catch(console.error);
  });

}, null, true, 'America/New_York');

