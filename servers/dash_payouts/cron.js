
const BluebirdPromise = require('bluebird');
const DashPayoutService = require('../../lib/payouts/dash');
const Account = require('../../lib/models/account');
const DashPayout = require('../../lib/models/dash_payout');
const database = require('../../lib/database');
const amqp = require('amqplib');

const DASH_PAYOUT_QUEUE = 'dash:payouts';
const AMQP_URL          = 'amqp://blockcypher.anypay.global';

const EVERY_DAY = '0 0 0 * * *';
const EVERY_FIVE_SECONDS = '*/5 * * * * *';
const EVERY_HOUR = '0 0 * * * *';

var CronJob = require('cron').CronJob;
new CronJob(EVERY_HOUR, function() {

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
        return DashPayoutService.create(account.id).then(payout => {

        });
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

new CronJob(EVERY_HOUR, function() {

  database.sync().then(() => {

    DashPayout.findAll({ where: {
      completedAt: {
        $eq: null
      }
    }})
    .then(payouts => {

      if (payouts.length > 0) {
        console.info(`${payouts.length} payouts to enqueue`);

        amqp.connect(AMQP_URL).then(conn => {

          return conn.createChannel().then(channel => {
            console.log('channel connected');

            channel.assertQueue(DASH_PAYOUT_QUEUE, {durable: true}).then(() => {

              payouts.forEach(payout => {
                channel.sendToQueue(DASH_PAYOUT_QUEUE, 
                  Buffer.from(payout.id.toString())
                );
              });

              setTimeout(() => { conn.close() }, 10000);

            }); 

          });
        });
      }
    });
  });

}, null, true, 'America/New_York');

