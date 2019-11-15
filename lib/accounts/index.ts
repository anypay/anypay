const bcrypt = require('bcrypt');

import { models } from '../models';
import { log } from '../logger';

import {getAddress, getSupportedCoins} from './supported_coins';

import {emitter} from '../events'
import {AccountAddress} from '../core/types';

import * as addresses from '../addresses';  

import {setDenomination} from '../core';

import { awaitChannel } from '../amqp';

export async function setBankAccount( account_id: number, bank_account_id: number): Promise<any>{

  let account = await models.Account.findOne({where:{id: account_id}});

  await account.update({ bank_account_id })

  return account;

}


export async function findAllWithTags(tags: string[]): Promise<any> {

  const groups = await Promise.all(tags.map(async (tag) => {

    let tags = await models.AccountTag.findAll({
      where: { tag }
    })

    return tags.map(tag => tag.account_id);

  }));

  var intersection = groups.shift();

  groups.forEach(group => {

    intersection = getIntersection(intersection, group);

  });

  log.info('accounts.findallwithtags.result', {

    tags,

    account_ids: intersection

  });

  return intersection;

}

export async function registerAccount(email: string, password: string): Promise<any>{

  let passwordHash = await hash(password);

  let account = await models.Account.create({
    email: email,
    password_hash: passwordHash
  });

  if( account ){

    emitter.emit('account.created', account)

  }

  return account;
}

export async function create(email: string, password: string): Promise<any>{

  return registerAccount(email, password)

}

export async function createAccessToken(accountId: number): Promise<any> {

  let accessToken = models.AccessToken.create({
    account_id: accountId
  });

  return accessToken;

}

export async function setName(email: string, name: string): Promise<any> {

  let account = await models.Account.findOne({ where: { email }});

  if (!account) {

    throw new Error(`account ${email} not found`);

  }

  account.business_name = name; 

  await account.save();

  return account;

}

export async function setPhysicalAddress(email: string, address: string): Promise<any> {

  let account = await models.Account.findOne({ where: { email }});

  if (!account) {

    throw new Error(`account ${email} not found`);

  }

  account.physical_address = address; 

  await account.save();

  return account;

}

export async function getAccountAddress(accountId: number, currency: string): Promise<AccountAddress> {

  let coins = await getSupportedCoins(accountId);

  let coin = coins[currency];

  return coins[currency];

}

export function hash(password) {
  return new Promise((resolve, reject) => {

    bcrypt.hash(password, 10, (error, hash) => {
      if (error) { return reject(error) }
      resolve(hash);
    })
  });
}

export {
  getSupportedCoins,
  getAddress
}

function getIntersection(arrA, arrB) {
  return arrA.filter(x => arrB.includes(x));
}


export async function enableACH(account_id){

  let bankAccount = await  models.BankAccount.findOne({where: {account_id: account_id}});

  if(!bankAccount){
    throw new Error(`bank account is not set for account id: ${account_id}`);
  }

  const channel = await awaitChannel() 

  let account = await models.Account.findOne({ 
          where: { id: account_id } 
  })

  if( account ){


    await setDenomination({
            currency: "USD",
            account_id: account_id
    })

    const obj =[

      { currency: "DASH",  address : process.env.ANYPAY_EXCHANGE_DASH_ADDRESS},
      { currency: "BSV",  address : process.env.ANYPAY_EXCHANGE_BSV_ADDRESS},
      { currency: "BTC",  address : process.env.ANYPAY_EXCHANGE_BTC_ADDRESS},
      { currency: "BCH",  address : process.env.ANYPAY_EXCHANGE_BCH_ADDRESS}
    ]

    await Promise.all(
        obj.map(async (elem:any) => {

          elem.account_id = account_id;

          await addresses.setAddress(elem)

          await addresses.lockAddress(account_id, elem.currency)

        })
    );

    channel.publish('anypay.events', 'account.ach.enabled', new Buffer(JSON.stringify({"account_id": account_id })))

    account.ach_enabled = true;

    await account.save();

    account = await models.Account.findOne({where:{id: account_id}})

    return account;

  }else{

    throw new Error(`enableACH: No account found with id ${account_id}`);

  }

}

export async function disableACH(account_id){
       
  const channel = await awaitChannel() 

  let account = await models.Account.findOne({ 
          where: { id: account_id } 
  })

  if( account ){

    if( account.ach_enabled ){
          
      const obj =[
        { currency: "DASH",  address : process.env.ANYPAY_EXCHANGE_DASH_ADDRESS},
        { currency: "BSV",  address : process.env.ANYPAY_EXCHANGE_BSV_ADDRESS},
        { currency: "BTC",  address : process.env.ANYPAY_EXCHANGE_BTC_ADDRESS},
        { currency: "BCH",  address : process.env.ANYPAY_EXCHANGE_BCH_ADDRESS}
       ]
 
      await Promise.all(
        obj.map(async (item:any) => {
               
          item.account_id = account_id;
          await addresses.unsetAddress(item)

        })
      );
   
      account.ach_enabled = false;

      channel.publish('anypay.events', 'account.ach.disabled', new Buffer(JSON.stringify({"account_id": account_id })))

      await account.save();

      account = await models.Account.findOne({where:{id: account_id}})

      return account;

    }else{
    
      throw new Error(`disableACH: ACH is already disabled for ${account_id}`);

    }

  }else{

    throw new Error(`disableACH: No account found with id ${account_id}`);

  }

}
