const DashPayout = require("../models/dash_payout");
const Account = require("../models/account");
const Invoice = require("../models/invoice");
const log = require("winston");
const amqp = require('amqplib');

const DASH_PAYOUT_QUEUE = 'dash:payouts';

function pushPayoutToQueue(payoutId) {


  return conn.createChannel().then(channel => {
    log.debug('channel connected');

    return channel.assertQueue(DASH_PAYOUT_QUEUE, {durable: true}).then(() => {

      channel.sendToQueue(DASH_PAYOUT_QUEUE, Buffer.from(payoutId));

      setTimeout(() => {
        conn.close();
      }, 10000);

      return;
    }); 
  });

}

function payout(accountId) {
  let invoices;
  log.info('payout', accountId);
  
  var createdPayout;

  return new Promise((resolve, reject) => {
    Account.findOne({
      where: {
        id: accountId
      }
    })
    .then(account => {
      log.info('accountFound', account.toJSON());
      if (!account) {
        reject(new Error("account not found"));
      } else {
        if (!account.dash_payout_address) {
          reject(new Error("no payout address"));
        } else {
          Invoice.findAll({ where: {
            account_id: account.id,
            status: 'paid',
            settledAt: {
              $eq: null
            }
          }})
          .then(rInvoices => {
            invoices = rInvoices;
            if (invoices.length === 0) {
              return resolve();
            }

            let amount = invoices.reduce((accumulator, invoice) => {
              return accumulator + parseFloat(invoice.amount);
            }, 0);
            log.info(`${invoices.length} invoices to settle`);
            log.info('sum', amount);
            if (amount === 0) {
              return reject(new Error('invoices total zero'));
            }

            return DashPayout.create({
              account_id: account.id,
              amount: amount,
              address: account.dash_payout_address
            })
          })
          .then(payout => {
            createdPayout = payout;
            let settledAt = new Date();
            return Invoice.update({
              settledAt: settledAt 
            }, { where: {
              id: {
                $in: invoices.map(invoice => {
                       return invoice.id
                     })
              }}
            })
          })
          .then(nInvoicesUpdated => {
            log.info(`${nInvoicesUpdated} invoices updated`);

            pushPayoutToQueue(createdPayout.id).then(() => {
              log.info('pushed payout to queue', createdPayout.id);

              resolve();
            });
          })
          .catch(reject);
        }

      }
    })
    .catch(error => {
      log.error('some error', error.message); 
      reject(error);
    });
  });
}

module.exports.create = function(accountId) {

  return payout(accountId);
}

