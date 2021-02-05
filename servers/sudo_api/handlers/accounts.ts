const bcrypt = require('bcrypt');
const log = require('winston');
const Slack = require('../../../lib/slack/notifier');
const Boom = require('boom');

const { Op } = require('sequelize')

import { geocode } from '../../../lib/googlemaps';

import {emitter} from '../../../lib/events'

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


export async function showAddresses(request, reply){

  var account = await models.Account.findOne({
    where: {
      id: request.params.account_id
    },include:[{
      model: models.Address,
      as: 'addresses'
    }]
  })

  return {account}

}

export async function showAmbassadorRewards(request, reply){

  var account = await models.Account.findOne({
    where: {
      id: request.params.account_id
    },include:[{
      model: models.Ambassador,
      as: 'ambassador'
    },{
      model: models.AmbassadorReward,
      as: 'ambassador_rewards'
    }]
  })

  let ambassador = await models.Ambassador.findOne({ 
    where: {
      account_id: account.id 
    },
    include:[
      {
        model: models.Account,
        as: 'merchants'
      }]
  })

  if( ambassador){

    account = Object.assign(ambassador.toJSON(), account.toJSON())

  }

  return {account};

}

export async function showKioskRewards(request, reply){

   var account = await models.Account.findOne({
    where: {
      id: request.params.account_id
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
    }]
  });

  return {account}

}

export async function sudoShow (request, reply) {

  console.log("sudo show", request.params);

  var account = await models.Account.findOne({
    where: {
      id: request.params.account_id
    }
  });
  return {account};

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
  let where = {};

  if (request.query.email) {
    where['email'] = request.query.email;
  }

  var accounts = await models.Account.findAll({ where, offset, limit });

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

export async function accountVolume(req, reply){

  try{

   let volume = await getVolume(req.params.id)

   return volume;

  }catch(error){

    console.log(error)

    return(error)

  }

}
