const bcrypt = require('bcrypt');

import { models } from '../models';
import { log } from '../logger';

import {getAddress, getSupportedCoins} from './supported_coins';

import {emitter} from '../events'
import {AccountAddress} from '../core/types';

import * as addresses from '../addresses';  

import * as amqp from 'amqplib';

export async function setBankAccount( account_id: number, bank_account_id: number): Promise<any>{

  let account = await models.Account.findOne({where:{id: account_id}});

  account.bank_account_id = bank_account_id;

  await account.save();

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

  const connection = await amqp.connect(process.env.AMQP_URL);

  const channel = await connection.createChannel();

  let account = await models.Account.findOne({ 
          where: { id: account_id } 
  })

  if( account ){

    const obj =[

      { currency: "DASH",  address : process.env.ANYPAY_EXCHANGE_DASH_ADDRESS},
      { currency: "BSV",  address : process.env.ANYPAY_EXCHANGE_BSV_ADDRESS},
      { currency: "BTC",  address : process.env.ANYPAY_EXCHANGE_BTC_ADDRESS},
      { currency: "BCH",  address : process.env.ANYPAY_EXCHANGE_BCH_ADDRESS}
    ]

    for( let i = 0; i<obj.length; i++){

      let elem:any = obj[i]

      elem.account_id = account_id;

      await addresses.setAddress(elem)

      await addresses.lockAddress(account_id, elem.currency)


    }

    channel.publish('anypay.events', 'account.ach.enabled', new Buffer(JSON.stringify({"account_id": account_id })))

    account.ach_enabled = true;

    await account.save();

  }

  account = await models.Account.findOne({where:{id: account_id}})

  return account.toJSON()

}

export async function disableACH(account_id){
       
  const connection = await amqp.connect(process.env.AMQP_URL);

  const channel = await connection.createChannel();

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
 
      for( let i = 0; i<obj.length; i++){

        let elem:any = obj[i]

        elem.account_id = account_id;

        await addresses.unlockAddress(account_id, elem.currency)

        await addresses.unsetAddress(elem)
  
      }

   
      account.ach_enabled = false;

      channel.publish('anypay.events', 'account.ach.disabled', new Buffer(JSON.stringify({"account_id": account_id })))

      await account.save();

    }

  }

  account = await models.Account.findOne({where:{id: account_id}})

  return account.toJSON()

}
