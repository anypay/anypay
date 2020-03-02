const bcrypt = require('bcrypt');
const log = require('winston');
const Slack = require('../../../lib/slack/notifier');
const Boom = require('boom');

import { geocode } from '../../../lib/googlemaps';

import {emitter} from '../../../lib/events'

import { models } from '../../../lib';

import { getROI } from '../../../lib/roi';

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

    Slack.notify(`account:registered | ${request.account.email}`);
    
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
  var account = await models.Account.findOne({ where: { id: accountId } })

  return account;
};

export async function getRewards(request, reply) {

  let accountId = request.auth.credentials.accessToken.account_id;

  var account = await models.Account.findOne({
   where: {
     id: accountId 
   },include:[{
      model: models.VendingMachine,
      as: 'vending_machines'
    },
    {
      model: models.VendingTransaction,
      as: 'vending_transactions'
    },{
      model: models.VendingTransactionOutput,
      as: 'vending_transaction_outputs'
    },
    {
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

export async function calculateROI(req, reply){

  try{

   let roi = await getROI(req.account.id)

   return roi;

  }catch(error){

    console.log(error)

    return(error)

  }



}
