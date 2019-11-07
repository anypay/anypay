const log = require('winston');
const Boom = require('boom');
import { models, bankAccount, ach } from '../../../lib';

import * as http from 'superagent';

const postcode = require('postcode-validator');


export async function show(request, h){

  let bankAccount = await models.BankAccount.findOne({ where: { account_id: request.account.id}})

  return bankAccount;

}

export async function create(request, reply){

  let account = await models.BankAccount.findOne({ where: { account_id: request.account.id } })

  if( account ){

    return Boom.badRequest('account already has bank info set');

  }

  let bank_info = (await http.get(`https://www.routingnumbers.info/api/data.json?rn=${request.payload.routing_number}`)).body

  console.log(bank_info)

  if (bank_info.code != 200) {
    return Boom.badRequest(`no bank found with routing number ${request.payload.routing_number}`)
  }

  if(!postcode.validate(request.payload.zip, 'US')){
    return Boom.badRequest(`Invalid zip code ${request.payload.zip}`)
  }

  log.info(`controller:bank_account,action:create`);

  try{

    let payload = request.payload;

    payload.account_id = request.account.id;

    account = await bankAccount.create(payload)

    log.info(account.toJSON());

    return account;

  }catch(error){

    log.info(error)
    return Boom.badRequest(error)
  }

  return account

}

export async function confirmTest(request, h){

 try{

   let test = await ach.confirmTest( request.account.id, request.payload.response );

   return test;


 }catch(err){

    log.error(err)

    return Boom.badRequest(err.message)

 }

}
