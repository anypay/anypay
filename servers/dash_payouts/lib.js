/*

    Periodically check for invoices paid since the last dash_payout
    and create a dash_payout with the sum total of all the invoices.
*/

const Invoice = require("../../lib/models/invoice");
const DashPayout = require("../../lib/models/dash_payout");

function createPayout(accountId) {

  return new Promise((resolve, reject) => {

  // Find latest payout for account
    DashPayout.findOne({
      order: ['createdAt'],
      where: {
        account_id: accountId
      }
    })
    .then(latestPayout => {
      let query = {
        status: 'paid',
        account_id: accountId,
        settledAt: {
          $eq: null
        }
      };

      if (latestPayout) {
        console.log('latest payout', latestPayout.toJSON());
        query['paidAt'] = {
          $gt: latestPayout.createdAt
        }
      }

     // Get all invoices paid on or after latest payout

      console.log('query', query);

       return Invoice.findAll({
          where: query
       })
    })
    .then(invoices => {
      console.log(`${invoices.length} invoices found`);

      // sum each invoice to get total dash amount to pay out
      let sum = invoices.reduce((accumulator, invoice) => {
        return accumulator + parseFloat(invoice.amount);
      }, 0); 
      console.log("SUM", sum);

      if (sum > 0) {

        return DashPayout.create({
          amount: sum,
          account_id: accountId
        })
        .then(resolve)
      } else {
        resolve();
      }
    })
    .catch(reject);
  });
}

module.exports.createPayout = createPayout;

