require('dotenv').config();

import { find } from './plugins';

import { log } from './log'

interface DenominationChangeset {
  account_id: number;
  currency: string;
}

interface AddressChangeSet {
  account_id: number;
  currency: string;
  chain: string;
  address: string;
  metadata?: string;
  paymail?: string;
  view_key?: string;
  address_id?: number;
}

import {models} from "./models";

export async function setAddress(changeset: AddressChangeSet): Promise<any> {

  var isValid = true;

  let plugin = find({ chain: changeset.currency, currency: changeset.chain });

  if (changeset.address.match('@')) {

    changeset.paymail = changeset.address;

  }

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
    currency: changeset.currency,
    chain: changeset.chain
  }});

  if (address) {

    if (address.locked) {

      throw new Error(`${changeset.currency} address locked`);

    }

    await address.update({
      value: changeset.address,
      paymail: changeset.paymail,
      view_key: changeset.view_key,
      note: null
    });

  } else {

    address = await models.Address.create({
      account_id: changeset.account_id,
      currency: changeset.currency,
      chain: changeset.chain,
      value: changeset.address,
      view_key: changeset.view_key,
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

  await models.Account.update({
    denomination: changeset.currency
  }, {where: { id: changeset.account_id }});

  log.info('denomination.set', changeset)

  return;
}


