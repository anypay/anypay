require('dotenv').config();

import {plugins} from '../plugins';

import {
  AddressChangeSet,
  DenominationChangeset
} from './types/address_change_set';

import * as models from '../models';

import * as moment from 'moment';

import {Op} from 'sequelize';

import {Account, Invoice} from "../models";

import * as logger from "winston";

import {checkAddressForPayments} from '../../plugins/dash/lib/check_for_payments';

import { handlePayment } from '../payment_processor';

import * as Cron from 'cron';

import {emitter} from '../events'

logger.configure({
    transports: [
        new logger.transports.Console({
            colorize: true
        })
    ]
});

import {EventEmitter2} from 'eventemitter2';

const events = new EventEmitter2(); 

export async function setAddress(changeset: AddressChangeSet) {

  try {

    let plugin = await plugins.findForCurrency(changeset.currency);

    if (plugin.validateAddress) {

      changeset.address = await plugin.validateAddress(changeset.address);

    }

  } catch(error) {

    console.error('unable to validate address with plugin');

  }

  var updateParams;

  switch(changeset.currency) {
  case 'DASH':
    updateParams = {
      dash_payout_address: changeset.address
    };
    break; 
  case 'BTC':
    updateParams = {
      bitcoin_payout_address: changeset.address
    };
    break; 
  case 'BCH':
    updateParams = {
      bitcoin_cash_address: changeset.address
    };
    break; 
  case 'LTC':
    updateParams = {
      litecoin_address: changeset.address,
      litecoin_enabled: true
    };
    break;
  case 'XRP':
    updateParams = {
      ripple_address: changeset.address
    };
    break;
  case 'ZEC':
    updateParams = {
      zcash_t_address: changeset.address
    };
    break;
  case 'DOGE':
    updateParams = {
      dogecoin_address: changeset.address,
      dogecoin_enabled: false
    };
    break;
  default:
  }

  if (updateParams) {

    var res = await Account.update(updateParams, {where: { id: changeset.account_id }});

  } else {

    var address = await models.Address.findOne({ where: {
      account_id: changeset.account_id,
      currency: changeset.currency
    }});

    if (address) {

      console.log(`${changeset.currency} address already set`);

      await address.update({
        value: changeset.address
      });

    } else {

      address = await models.Address.create({
        account_id: changeset.account_id,
        currency: changeset.currency,
        value: changeset.address
      });

    }

  }

  emitter.emit('address.set', changeset);
  events.emit('address:set', changeset);


};

export async function unsetAddress(changeset: AddressChangeSet) {

  var updateParams;

  switch(changeset.currency) {
  case 'DASH':
    updateParams = {
      dash_payout_address: null
    };
    break; 
  case 'BTC':
    updateParams = {
      bitcoin_payout_address: null
    };
    break; 
  case 'BCH':
    updateParams = {
      bitcoin_cash_address: null
    };
    break; 
  case 'LTC':
    updateParams = {
      litecoin_address: null
    };
    break;
  case 'XRP':
    updateParams = {
      ripple_address: null
    };
    break;
  case 'ZEC':
    updateParams = {
      zcash_t_address: null
    };
    break;
  case 'DOGE':
    updateParams = {
      dogecoin_address: null
    };
    break;
  default:
  }

  if (updateParams) {

    var res = await Account.update(updateParams, {where: { id: changeset.account_id }});

  } else {

    var address = await models.Address.findOne({ where: {
      account_id: changeset.account_id,
      currency: changeset.currency
    }});

    await address.destroy({ force: true });

  }

  events.emit('address:unset', changeset);

};

export async function setDenomination(changeset: DenominationChangeset): Promise<any> {

  var res = await Account.update({
    denomination: changeset.currency
  }, {where: { id: changeset.account_id }});

  events.emit('denomination:set', changeset);

  return;
}

export async function getRecentlyUnpaidInvoices(sinceDate?: Date, currency?: string) {

  if (!sinceDate) {

    // default to one day ago
    sinceDate = moment().subtract(1, 'days').toDate();

  }

  let query = {

    where: {

      createdAt: {

        [Op.gt]: sinceDate

      },

      status: 'unpaid'

    }

  };

  if (currency) {

    query['currency'] = currency;

  }

  let recentlyUnpaidInvoices = await Invoice.findAll(query);

  return recentlyUnpaidInvoices;

}

export async function sweepUnpaid() {

  // Lookup all unpaid DASH invoices, check for payment

  let invoices = await getRecentlyUnpaidInvoices(); 

  for (const invoice of invoices) {

    if (invoice.currency === 'DASH') {
    
      let balance = await checkAddressForPayments(invoice.address);

      if (balance.total_received > 0) {

        let amountPaid = balance.total_received / 100000000.00000;

        let payment = {
          currency: 'DASH',
          address: balance.address,
          amount: invoice.amount,
          hash: balance.txrefs[0].tx_hash
        };

        await handlePayment(invoice, payment);
        
        console.log(payment);

      }

    }
    
  };

}


export { events, logger };

