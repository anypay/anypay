
import * as dash from '../../../plugins/dash/lib/jsonrpc';

import * as bch from '../../../plugins/bch/lib/jsonrpc';

import { log, models, database, amqp } from '../../../lib';

import * as cashbackDash from '../../../plugins/dash/lib/cashback';
import * as cashbackBch from '../../../plugins/bch/lib/cashback';


async function getCashBackBalance(coin: string): Promise<number> {

  switch(coin.toUpperCase()) {

    case 'DASH':

      return cashbackDash.getCashBackBalance()

    case 'BCH':

      return cashbackBch.getCashBackBalance()
  }

}

import * as Boom from 'boom';
import * as http from 'superagent';

const coins: any = {

  'DASH': {
    address: 'XjCsG5H4ijNU9iwr3MvGz6AkMMhHtYUoeB',
    balance: null
  },

  'BCH': {
    address: cashbackBch.getCashBackAddress(),
    balance: null
  }

};

export async function index(req, h) {

  try {

    let cashbackRecords = await models.CashbackCustomerPayment.findAll({
      order: [
        ['createdAt', 'DESC'],
      ],
      limit: req.query.limit || 100,
      include: [
         { model: models.Invoice, where: { status: 'paid' }}
      ]
    });

    return cashbackRecords;

  } catch(error) {

    return Boom.badRequest(error.message);

  }

}

export async function retry(req, h) {

  try {

    let invoice = await models.Invoice.findOne({ where: {
      uid: req.params.invoice_uid
    }});

    if (!invoice) {
      throw new Error(`invoice ${req.params.invoice_uid} not found`);
    }

    let channel = await amqp.awaitChannel();

    let message = Buffer.from(invoice.uid);

    await channel.sendToQueue('cryptozone:cashback:customers', message);

    return {
      invoice_uid: invoice.uid,
      success: true
    }

  } catch(error) {

    return Boom.badRequest(error.message);

  }

}

export async function dashboard(req, h) {

  try {

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

    var bchBalance, dashBalance;

    try {

      bchBalance = await getCashBackBalance('BCH');

    } catch(error) {

      bchBalance = '?'

      console.log('error getting BCH balance', error.message);

    }

    try {

      dashBalance = await getCashBackBalance('DASH');

    } catch(error) {

      bchBalance = '?'

      console.log('error getting DASH balance', error.message);

    }

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

  } catch(error) {

    return Boom.badRequest(error.message);

  }

}

async function updateStats() {

  coins['DASH'].balance = await getCashBackBalance('DASH');

  log.info('cashback.balance', {
    coin: "DASH",
    balance: coins['DASH'].balance
  });

  coins['BCH'].balance = await getCashBackBalance('BCH');

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

