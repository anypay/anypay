const bcrypt = require('bcryptjs');
const Boom = require('boom');
var geoip = require('geoip-lite');

import {emitter} from '../../../lib/events'

import {Op} from 'sequelize'

import * as moment from 'moment'

import { coins, models, accounts, slack, log, utils } from '../../../lib';

import { near } from '../../../lib/accounts'

function hash(password) {
  return new Promise((resolve, reject) => {

      bcrypt.hash(password, 10, (error, hash) => {
        if (error) { return reject(error) }
        resolve(hash);
    })
  });
}

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

  try {

    let account = await accounts.updateAccount(req.account, req.payload);

    slack.notify(`${account.email} updated their profile ${utils.toKeyValueString(req.payload)}`)

    return {

      success: true,

      account

    }

  } catch(error) {

    return Boom.badRequest(error.message);

  }

}

export async function createAnonymous(request, reply) {

  try {

    let account = await models.Account.create();

    log.info(`anonymous account ${account.uid} created`);

    let access_token = await models.AccessToken.create({ account_id: account.id });

    return { account, access_token }

  } catch(error) {

    log.error(`error creating anonymous account ${error.message}`);

    return Boom.badRequest(error);
  }

}

export async function registerAnonymous(request, reply) {
  let email = request.payload.email;

  log.info('create.account', email);

  let passwordHash = await hash(request.payload.password);

  request.account.email = request.payload.email;
  request.account.password_hash = passwordHash;

  try {

    request.account.save();

    slack.notify(`account:registered | ${request.account.email}`);
    
    emitter.emit('account.created', request.account)

    return request.account;

  } catch(error) {

    log.error(`account ${email} already registered`);

    return Boom.badRequest(
      new Error(`account ${email} already registered`)
    );
  }
}

export async function create (request, reply) {
  let email = request.payload.email;

  log.info('create.account', email);

  let passwordHash = await hash(request.payload.password);

  try {
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

  } catch(error) {

    log.error(`account ${email} already registered`);

    return Boom.badRequest(
      new Error(`account ${email} already registered`)
    );
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

    console.log(error)

    return Boom.badRequest(error)

  }
}

export async function show (request, reply) {

  var account = request.account,
      ambassador,
      addresses,
      tipjars

  if (account.ambassador_id) {
    log.info(`find ambassador ${account.ambassador_id}`)
    var record = await models.Ambassador.findOne({ where: { id: account.ambassador_id }})
    log.info('ambassador', record.toJSON())

    if (record) {
      let ambassador_account = await models.Account.findOne({
        where: {
          id: record.account_id
        },
        attributes: ['id', 'email'] 
      });
      if (ambassador_account) {
        log.info('ambassador.account', ambassador)

        ambassador = Object.assign({
          id: record.id,
          account_id: ambassador_account.id,
          email: ambassador_account.email
        })
      }
    }

  }

  addresses = await models.Address.findAll({ where: {
    account_id: account.id
  }});

  tipjars = await models.Tipjar.findAll({ where: {
    account_id: account.id
  }});

  return  {
    account,
    ambassador,
    addresses,
    tipjars
  }

};

export async function getRewards(request, reply) {

  let accountId = request.auth.credentials.accessToken.account_id;

  var account = await models.Account.findOne({
   where: {
     id: accountId 
   },include:[{
      model: models.Ambassador,
      as: 'ambassador'
    },{
      model: models.AmbassadorReward,
      as: 'ambassador_rewards'
    }]
  });

  let ambassador = await models.Ambassador.findOne({ 
    where: {
      account_id: account.id 
    },
    include:[
      {
        model: models.Account,
        as: 'merchants'
      },{
        model: models.AmbassadorReward,
        as: 'rewards'
      }
    ]
  })

  if( ambassador){

    account = Object.assign(ambassador.toJSON(), account.toJSON())

  }

  return {account};

};


export async function sudoShow (request, reply) {

  var account = await models.Account.findOne({
    where: {
      id: request.params.account_id
    }
  });

  return account;
};

export async function sudoAccountWithEmail (request, reply) {

  var account = await models.Account.findOne({
    where: {
      email: request.params.email
    }
  });

  return account;
}

export async function index(request, reply) {

  let limit = parseInt(request.query.limit) || 100;
  let offset = parseInt(request.query.offset) || 0;

  var accounts = await models.Account.findAll({ offset, limit });

  return accounts;
};

export async function destroy(request, reply) {

  let account = await models.Account.findOne({
    where: { id: request.params.account_id }
  });

  if (!account) {
    log.error(`account ${request.params.account_id} not found`);
    return { error: 'account not found' };
  }

  await models.AccessToken.destroy({
    where: {
      account_id: account.id
    }
  });

  await models.Address.destroy({
    where: {
      account_id: account.id
    }
  });

  await models.Invoice.destroy({
    where: {
      account_id: account.id
    }
  });

  await models.Account.destroy({
    where: {
      id: account.id
    }
  });

  return { success: true };
};

