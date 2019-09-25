const bcrypt = require('bcrypt');
const log = require('winston');
const Slack = require('../../../lib/slack/notifier');
const Boom = require('boom');


import { geocode } from '../../../lib/googlemaps';

import {emitter} from '../../../lib/events'

import { getROI } from '../../../lib/roi';

import { getVolume } from '../../../lib/sudo/volume';

import { models } from '../../../lib';

function hash(password) {
  return new Promise((resolve, reject) => {

    bcrypt.hash(password, 10, (error, hash) => {
      if (error) { return reject(error) }
      resolve(hash);
    })
  });
}

export async function sudoShow (request, reply) {
  console.log("sudo show", request.params);

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

   let roi = await getROI(req.params.id)

   return roi;

  }catch(error){

    console.log(error)

    return(error)

  }

}

export async function accountVolume(req, reply){

  try{

   let volume = await getVolume(req.params.id)

   return volume;

  }catch(error){

    console.log(error)

    return(error)

  }

}
