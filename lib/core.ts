/*
    This file is part of anypay: https://github.com/anypay/anypay
    Copyright (c) 2017 Anypay Inc, Steven Zeiler

    Permission to use, copy, modify, and/or distribute this software for any
    purpose  with  or without fee is hereby granted, provided that the above
    copyright notice and this permission notice appear in all copies.

    THE  SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
    WITH  REGARD  TO  THIS  SOFTWARE  INCLUDING  ALL  IMPLIED  WARRANTIES  OF
    MERCHANTABILITY  AND  FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
    ANY  SPECIAL ,  DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
    WHATSOEVER  RESULTING  FROM  LOSS  OF USE, DATA OR PROFITS, WHETHER IN AN
    ACTION  OF  CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
    OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
//==============================================================================
require('dotenv').config();

import { find } from './plugins';

import { log } from './log'
import prisma from './prisma';

import { addresses as Address } from '@prisma/client'

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

export async function setAddress(changeset: AddressChangeSet): Promise<Address> {

  var isValid = true;

  let plugin = find({ chain: changeset.chain, currency: changeset.currency });

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

  var address = await prisma.addresses.findFirst({
    where: {
      account_id: changeset.account_id,
      currency: changeset.currency,
      chain: changeset.chain
    }
  })

  if (address) {

    if (address.locked) {

      throw new Error(`${changeset.currency} address locked`);

    }

    address = await prisma.addresses.update({
      where: {
        id: address.id
      },
      data: {
        value: changeset.address,
        paymail: changeset.paymail,
        view_key: changeset.view_key,
        note: null    
      }
    })


  } else {

    address = await prisma.addresses.create({
      data: {
        account_id: changeset.account_id,
        currency: changeset.currency,
        chain: changeset.chain,
        value: changeset.address,
        view_key: changeset.view_key,
        paymail: changeset.paymail,
        updatedAt: Date(),
        createdAt: Date()
      }
    });

  }

  log.info('address.set', address)

  return address;

};

export async function unsetAddress(changeset: AddressChangeSet): Promise<void> {


  const address = await prisma.addresses.findFirstOrThrow({
    where: {
      account_id: changeset.account_id,
      currency: changeset.currency   
    }
  })

  if (address?.locked) {

    let error = new Error(`${changeset.currency} address locked`);

    log.error('address.unset.locked', error)

    throw error

  }


  await prisma.addresses.delete({
    where: {
      id: address.id
    }
  
  })

  log.info('address.removed', address)

};

export async function setDenomination(changeset: DenominationChangeset): Promise<any> {

  await prisma.accounts.update({
    where: {
      id: changeset.account_id
    },
    data: {
      denomination: changeset.currency
    }
  })

  log.info('account.quote.set', changeset)

  return;
}


