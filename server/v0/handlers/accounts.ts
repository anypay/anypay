
import {Op} from 'sequelize'

import * as moment from 'moment'

import { coins, models, accounts, slack, log } from '../../../lib';

import { hash } from '../../../lib/bcrypt'

function toKeyValueString(json: any): string {

  let entries = Object.entries(json)

  return entries.reduce((str, entry) => {

    return `${str}${entry[0]}=${entry[1]} `

  }, '')

}

export async function update(req, h) {

  let account = await accounts.updateAccount(req.account, req.payload);

  slack.notify(`${account.email} updated their profile ${toKeyValueString(req.payload)}`)

  return {

    success: true,

    account

  }

}

export async function create (request, h) {

  let email = request.payload.email;

  log.info('create.account', email);

  let passwordHash = await hash(request.payload.password);

  let account = await models.Account.create({
    email: request.payload.email,
    password_hash: passwordHash,
    registration_ip_address: request.info.remoteAddress
  });

  return account;

}

export async function showPublic (req, h) {

  let account = await models.Account.findOne({
    where: {
      email: req.params.id
    }
  });

  if (!account) {

    account = await models.Account.findOne({
      where: {
        id: req.params.id
      }
    });
  }

  if (!account) {

    return h.notFound();
  }

  let addresses = await models.Address.findAll({

    where: {
      account_id: account.id
    }

  });

  let payments = await models.Invoice.findAll({

    where: {
      account_id: account.id,
      status: 'paid',
      createdAt: {
        [Op.gte]: moment().subtract(1, 'month')
      }
    },

    order: [["createdAt", "desc"]]
  
  })

  let latest = await models.Invoice.findOne({

    where: {
      account_id: account.id,
      status: 'paid'
    },

    order: [["createdAt", "desc"]]
  
  })

  if (latest) {
    latest = {
      time: latest.paidAt,
      denomination_amount: latest.denomination_amount,
      denomination_currency: latest.denomination_currency,
      currency: latest.currency
    }
  }

  return {
    id: account.id,
    name: account.business_name,
    physical_address: account.physical_address,
    coordinates: {
      latitude: account.latitude,
      longitude: account.longitude
    },
    coins: addresses.filter(a => {
      let coin = coins.getCoin(a.currency)
      return !!coin && !coin.unavailable
    }).map(a => a.currency),
    payments: {
      last_30_days: payments.length,
      latest: latest
    }

  }

}

export async function show (request, h) {

  var account = request.account,
      addresses

  addresses = await models.Address.findAll({ where: {
    account_id: account.id
  }});

  return  {
    account,
    addresses
  }

};
