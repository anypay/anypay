
import * as dash from '../../../plugins/dash/lib/jsonrpc';
import * as bch from '../../../plugins/bch/lib/jsonrpc';

import { log, models, database } from '../../../lib';

import { RPCSimpleWallet } from 'rpc-simple-wallet';

const coins: any = {

  'DASH': {
    address: 'Xymo4w1fDkig77VBd1s6si1mZWwKxdgXvJ',
    wallet: new RPCSimpleWallet('DASH', 'Xymo4w1fDkig77VBd1s6si1mZWwKxdgXvJ'),
    balance: null
  },

  'BCH': {
    address: 'bitcoincash:qp9jz20u2amv4cp5wm02zt7u00lujpdtgy48zsmlvp',
    wallet: new RPCSimpleWallet('BCH', 'bitcoincash:qp9jz20u2amv4cp5wm02zt7u00lujpdtgy48zsmlvp'),
    balance: null
  }

};

async function updateStats() {

  await coins['DASH'].wallet.updateWallet();
  coins['DASH'].balance = await coins['DASH'].wallet.getAddressUnspentBalance();

  log.info('cashback.balance', {
    coin: "BCH",
    balance: coins['DASH'].balance
  });

  await coins['BCH'].wallet.updateWallet();
  coins['BCH'].balance = await coins['BCH'].wallet.getAddressUnspentBalance();

  log.info('cashback.balance', {
    coin: 'BCH',
    balance: coins['BCH'].balance
  });

}

(async function() {

  setInterval(async () => {

    console.log('update cashback balances');

    await updateStats();

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

  let bchBalance = await coins['BCH'].wallet.getAddressUnspentBalance();
  let dashBalance = await coins['DASH'].wallet.getAddressUnspentBalance();

  return [{                                                                       
    currency: 'BCH',
    name: 'Bitcon Cash',
    donation_address: coins['BCH'].address,
    donations: "?",
    total_donations: "?",
    amount_remaining: bchBalance || 0,
    total_paid: totalBchPaid[0][0].sum,
    number_payments: bchPayments.length,
    eligible_merchants: merchants.length,
  }, {                                                                            
    currency: 'DASH',
    name: 'Dash',
    donation_address: coins['DASH'].address,
    donations: "?",
    total_donations: "?",
    amount_remaining: dashBalance || 0,
    total_paid: totalDashPaid[0][0].sum,
    number_payments: dashPayments.length,
    eligible_merchants: merchants.length
  }] 

}

