require('dotenv').config();

import {plugins} from '../plugins';

import {
  AddressChangeSet,
  DenominationChangeset
} from './types/address_change_set';

import * as moment from 'moment';

import {Op} from 'sequelize';

import {models} from "../models";

import * as logger from "winston";

import {checkAddressForPayments} from '../../plugins/dash/lib/check_for_payments';

import { handlePayment } from '../payment_processor';

import * as Cron from 'cron';

import {emitter} from '../events'

logger.configure({
    transports: [
        new logger.transports.Console()
    ]
});

import {EventEmitter2} from 'eventemitter2';

const events = new EventEmitter2(); 

export async function setAddress(changeset: AddressChangeSet): Promise<string> {

  var isValid = false;

  try {

    let plugin = await plugins.findForCurrency(changeset.currency);

    if (plugin.transformAddress) {

      changeset.address = await plugin.transformAddress(changeset.address);

    }

    if (plugin.validateAddress) {

      isValid = await plugin.validateAddress(changeset.address);

    }

  } catch(error) {

    console.error(error)
    console.error('unable to validate address with plugin');

  }

  if(!isValid){
  
    throw(`invalid ${changeset.currency} address`)

  }

  var address = await models.Address.findOne({ where: {
    account_id: changeset.account_id,
    currency: changeset.currency
  }});

  if (address) {

    console.log(`${changeset.currency} address already set`);

    if (address.locked) {

      throw new Error(`${changeset.currency} address locked`);

    }

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

  emitter.emit('address.set', changeset);
  events.emit('address:set', changeset);

  return address.value;

};

export async function unsetAddress(changeset: AddressChangeSet) {

    var address = await models.Address.findOne({ where: {
      account_id: changeset.account_id,
      currency: changeset.currency
    }});

    if (address.locked) {

      throw new Error(`${changeset.currency} address locked`);

    }

    await address.destroy({ force: true });

  events.emit('address:unset', changeset);

};

export async function setDenomination(changeset: DenominationChangeset): Promise<any> {

  var res = await models.Account.update({
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

  let recentlyUnpaidInvoices = await models.Invoice.findAll(query);

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

