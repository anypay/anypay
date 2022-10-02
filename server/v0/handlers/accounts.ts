const Boom = require('boom');
var geoip = require('geoip-lite');

import {Op} from 'sequelize'

import * as moment from 'moment'

import { coins, models, accounts, slack, log, utils } from '../../../lib';

import { near } from '../../../lib/accounts'

export async function nearby(req, h) {

  try {

    let accounts = await near(req.params.latitude, req.params.longitude, req.query.limit)

    return { accounts }

  } catch(error) {

    log.error('api.v0.Accounts.nearby', error)

    return h.badRequest(error)

  }

}

export async function update(req, h) {

  try {

    let account = await accounts.updateAccount(req.account, req.payload);

    slack.notify(`${account.email} updated their profile ${utils.toKeyValueString(req.payload)}`)

    return {

      success: true,

      account

    }

  } catch(error) {

    log.error('api.v0.Accounts.update', error)

    return h.badRequest(error)

  }

}

export async function create (request, h) {

  try {
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
    
    return account;

  } catch(error) {

    log.error('api.v0.Accounts.create', error)

    return h.badRequest(error)

  }

}

export async function showPublic (req, h) {

  try {

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

  } catch(error) {

    log.error('api.v0.Accounts.showPublic', error)

    return h.badRequest(error)

  }

}

export async function show (request, h) {

    try {

    var account = request.account,
        addresses

    addresses = await models.Address.findAll({ where: {
      account_id: account.id
    }});

    return  {
      account,
      addresses
    }
    
  } catch(error) {

    log.error('api.v0.Accounts.show', error)

    return h.badRequest(error)

  }
};

export async function index(request, h) {

  try {

    let limit = parseInt(request.query.limit) || 100;
    
    let offset = parseInt(request.query.offset) || 0;

    var accounts = await models.Account.findAll({ offset, limit });

    return accounts;

  } catch(error) {

    log.error('api.v0.Accounts.nearby', error)

    return h.badRequest(error)

  }

};

