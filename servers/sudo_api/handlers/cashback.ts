
import * as dash from '../../../plugins/dash/lib/jsonrpc';
import * as bch from '../../../plugins/bch/lib/jsonrpc';

import { log, models, database } from '../../../lib';

const coins: any = {

  'DASH': {
    address: 'Xymo4w1fDkig77VBd1s6si1mZWwKxdgXvJ',
    balance: null
  },

  'BCH': {
    address: 'bitcoincash:qp9jz20u2amv4cp5wm02zt7u00lujpdtgy48zsmlvp',
    balance: null
  }

};

async function updateStats() {

  console.log('update stats');

  var dashBalance = await dash.rpc.call('getbalance', [coins['DASH'].address, 0]);

  console.log('dashBalance', dashBalance);

  coins['DASH'].balance = dashBalance.result;

  var bchBalance = await bch.rpc.call('getbalance', [coins['BCH'].address, 0]);

  console.log('bchBalance', dashBalance);

  coins['BCH'].balance = bchBalance.result;

}

(async function() {

  setInterval(async () => {

    updateStats();

  }, 1000 * 60); // every minute

  updateStats();

})();


export async function dashboard(req, h) {

  let merchants = await models.CashbackMerchant.findAll();

  let dashPayments = await models.CashbackCustomerPayment.findAll({
    where: {
      currency: 'DASH'
    }
  });

  let bchPayments = await models.CashbackCustomerPayment.findAll({
    where: {
      currency: 'BCH'
    }
  });

  let totalBchPaid = await database.query(`select sum(amount) from cashback_customer_payments where currency='BCH'`);
  let totalDashPaid = await database.query(`select sum(amount) from cashback_customer_payments where currency='DASH'`);

  return [{                                                                       
    currency: 'BCH',
    name: 'Bitcon Cash',
    donation_address: coins['BCH'].address,
    donations: "?",
    total_donations: "?",
    amount_remaining: coins['BCH'].balance || 0,
    total_paid: totalBchPaid[0][0].sum,
    number_payments: bchPayments.length,
    eligible_merchants: merchants.length,
  }, {                                                                            
    currecy: 'DASH',
    name: 'Dash',
    donation_address: coins['DASH'].address,
    donations: "?",
    total_donations: "?",
    amount_remaining: coins['DASH'].balance || 0,
    total_paid: totalDashPaid[0][0].sum,
    number_payments: dashPayments.length,
    eligible_merchants: merchants.length
  }] 

}

