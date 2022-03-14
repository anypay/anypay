require('dotenv').config();

import {plugins} from '../plugins';

import * as bsv from 'bsv';

import * as events from '../events'

import { log } from '../log'

interface DenominationChangeset {
  account_id: number;
  currency: string;
}

interface AddressChangeSet {
  account_id: number;
  currency: string;
  address: string;
  metadata?: string;
  paymail?: string;
  address_id?: number;
}

import {models} from "../models";

import {getPaymail as bsvGetPaymail} from '../../plugins/bsv';

async  function getPaymail(currency, address) {

  if (currency !== 'BSV') {
    return null;
  }

  let paymail = await bsvGetPaymail(address);

  if (paymail) {

    try {

      new bsv.Address(address); 

      return null;

    } catch(error) {

      return address;

    }

  }

}

export async function setAddress(changeset: AddressChangeSet): Promise<any> {

  var isValid = true;

  let plugin = await plugins.findForCurrency(changeset.currency);

  let paymail = await getPaymail(changeset.currency, changeset.address);

  changeset.paymail = paymail;

  if (plugin.transformAddress) {

    changeset.address = await plugin.transformAddress(changeset.address);

  }

  if (plugin.validateAddress) {

    isValid = await plugin.validateAddress(changeset.address);

  }


  if(!isValid){
  
    throw(`invalid ${changeset.currency} address`)

  }

  var address = await models.Address.findOne({ where: {
    account_id: changeset.account_id,
    currency: changeset.currency
  }});

  if (address) {

    if (address.locked) {

      throw new Error(`${changeset.currency} address locked`);

    }

    await address.update({
      value: changeset.address,
      paymail: changeset.paymail,
      note: null
    });

  } else {

    address = await models.Address.create({
      account_id: changeset.account_id,
      currency: changeset.currency,
      value: changeset.address,
      paymail: changeset.paymail
    });

  }

  changeset.address_id = address.id;

  log.info('address.set', changeset)

  return address;

};

export async function unsetAddress(changeset: AddressChangeSet) {

  var address = await models.Address.findOne({ where: {
    account_id: changeset.account_id,
    currency: changeset.currency
  }});

  if (address.locked) {

    let error = new Error(`${changeset.currency} address locked`);

    log.error('address.unset.locked', error)

    throw error

  }

  await address.destroy({ force: true });

  log.info('address.unset', changeset)

};

export async function setDenomination(changeset: DenominationChangeset): Promise<any> {

  var res = await models.Account.update({
    denomination: changeset.currency
  }, {where: { id: changeset.account_id }});

  events.record({
    event: 'denomination.set',
    payload: changeset,
    account_id: changeset.account_id
  });

  return;
}

export { events };

