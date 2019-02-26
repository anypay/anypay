const bcrypt = require('bcrypt');
const log = require('winston');
const Slack = require('../../../lib/slack/notifier');
const Boom = require('boom');


import { geocode } from '../../../lib/googlemaps';

import {emitter} from '../../../lib/events'

import * as models from '../../../lib/models';
import { Account } from '../../../lib/models';

function hash(password) {
  return new Promise((resolve, reject) => {

    bcrypt.hash(password, 10, (error, hash) => {
      if (error) { return reject(error) }
      resolve(hash);
    })
  });
}

export async function update(req, h) {

  let account = await models.Account.findOne({ where: {

    id: req.account.id

  }});

  if (!account) {

    return {

      success: false,

      error: 'account not found'

    }

  }

  let updateAttrs: any = Object.assign(req.payload, {});

  if (updateAttrs.physical_address) {

    try {

      let geolocation = await geocode(updateAttrs.physical_address);

      updateAttrs.latitude = geolocation.lat;
      updateAttrs.longitude = geolocation.lng;

    } catch (error) {

      log.error('error geocoding address', error.message);

    }

  }

  await models.Account.update(updateAttrs, {

    where: { id: req.account.id }

  });

  account = await models.Account.findOne({ where: {

    id: req.account.id

  }});

  return {

    success: true,

    account

  }

}


export async function create (request, reply) {
  let email = request.payload.email;

  log.info('create.account', email);

  let passwordHash = await hash(request.payload.password);

  try {
    let account = await Account.create({
      email: request.payload.email,
      password_hash: passwordHash
    });

    Slack.notify(`account:created | ${account.email}`);
    
    emitter.emit('account.created', account)

    return account;

  } catch(error) {

    log.error(`account ${email} already registered`);

    return Boom.badRequest(
      new Error(`account ${email} already registered`)
    );
  }
}


export async function show (request, reply) {
  let accountId = request.auth.credentials.accessToken.account_id;
  var account = await Account.findOne({ where: { id: accountId } })

  return account;
};

export async function sudoShow (request, reply) {

  var account = await Account.findOne({
    where: {
      id: request.params.account_id
    }
  });

  return account;
};

export async function sudoAccountWithEmail (request, reply) {

  var account = await Account.findOne({
    where: {
      email: request.params.email
    }
  });

  return account;
}

export async function index(request, reply) {

  let limit = parseInt(request.query.limit) || 100;
  let offset = parseInt(request.query.offset) || 0;

  var accounts = await Account.findAll({ offset, limit });

  return accounts;
};

export async function destroy(request, reply) {

  let account = await Account.findOne({
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

