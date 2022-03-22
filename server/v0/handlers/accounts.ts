const Boom = require('boom');
var geoip = require('geoip-lite');

import {emitter} from '../../../lib/events'

import {Op} from 'sequelize'

import * as moment from 'moment'

import { coins, models, accounts, slack, log, utils } from '../../../lib';

import { near } from '../../../lib/accounts'

function sanitize(account) {
  let json = account.toJSON()
  delete json['authenticator_secret']
  delete json['password_hash']
  delete json['is_admin']
}

export async function nearby(req, h) {

  let accounts = await near(req.params.latitude, req.params.longitude, req.query.limit)

  return { accounts }

}

export async function update(req, h) {

  let account = await accounts.updateAccount(req.account, req.payload);

  slack.notify(`${account.email} updated their profile ${utils.toKeyValueString(req.payload)}`)

  return {

    success: true,

    account

  }

}

export async function createAnonymous(request, h) {

  let account = await models.Account.create();

  log.info(`anonymous account ${account.uid} created`);

  let access_token = await models.AccessToken.create({ account_id: account.id });

  return { account, access_token }

}

export async function registerAnonymous(request, h) {
  let email = request.payload.email;

  log.info('create.account', email);

  let passwordHash = await utils.hash(request.payload.password);

  request.account.email = request.payload.email;
  request.account.password_hash = passwordHash;

  request.account.save();

  slack.notify(`account:registered | ${request.account.email}`);
  
  emitter.emit('account.created', request.account)

  return request.account;

}

export async function create (request, h) {
  let email = request.payload.email;

  log.info('create.account', email);

  let passwordHash = await utils.hash(request.payload.password);

  let account = await models.Account.create({
    email: request.payload.email,
    password_hash: passwordHash
  });

  let geoLocation = geoip.lookup(request.headers['x-forwarded-for'] || request.info.remoteAddress)

  if (geoLocation) {

    let userLocation = utils.toKeyValueString(Object.assign(geoLocation, { ip: request.info.remoteAddress }))

    slack.notify(`${account.email} registerd from ${userLocation}`);

    account.registration_geolocation = geoLocation

  } else {

    slack.notify(`${account.email} registerd from ${request.info.remoteAddress}`);

  }

  account.registration_ip_address = request.info.remoteAddress

  account.save()
  
  emitter.emit('account.created', account)

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

    return Boom.notFound();
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

export async function index(request, h) {

  let limit = parseInt(request.query.limit) || 100;
  let offset = parseInt(request.query.offset) || 0;

  var accounts = await models.Account.findAll({ offset, limit });

  return accounts;
};

