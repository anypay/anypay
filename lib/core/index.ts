import {EventEmitter2} from 'eventemitter2';

import {
  AddressChangeSet,
  DenominationChangeset
} from './types/address_change_set';

const Account = require("../models/account");

import * as logger from "winston";

logger.configure({
    transports: [
        new logger.transports.Console({
            colorize: true
        })
    ]
});

const events = new EventEmitter2(); 

export async function setAddress(changeset: AddressChangeSet) {

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

  if (!updateParams) {

    throw new Error('valid currency and address must be provided');

  }

  var res = await Account.update(updateParams, {where: { id: changeset.account_id }});
  
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

  if (!updateParams) {

    throw new Error('valid currency and address must be provided');
  }

  var res = await Account.update(updateParams, {where: { id: changeset.account_id }});

  events.emit('address:unset', changeset);

};

export async function setDenomination(changeset: DenominationChangeset): Promise<any> {

  var res = await Account.update({
    denomination: changeset.currency
  }, {where: { id: changeset.account_id }});

  events.emit('denomination:set', changeset);

  return;
}

export { events, logger };

