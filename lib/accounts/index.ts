const bcrypt = require('bcryptjs');

interface Map<T> {
    [key: string]: T;
}

type AccountAddresses = Map<AccountAddress>;

interface AccountAddress {
  account_id: number;
  currency: string;
  address: string;
  xpubkey: boolean;
  nonce: number;
  enabled: boolean;
  name?: string;
  code?: string;
}

import { models } from '../models';
import { awaitChannel } from '../amqp';
import { log } from '../logger';
import * as database from '../database';

import {getAddress, getSupportedCoins} from './supported_coins';

import {events} from '../events'

import * as geocoder from '../googlemaps';

export async function near(latitude, longitude, limit=100) {
let query = `SELECT *,
	ST_Distance(
    position,
    'SRID=4326;POINT(${parseFloat(longitude)} ${parseFloat(latitude)})'::geometry
    ) AS distance
    from accounts where position is not null and business_name is not null order by distance limit ${limit};`

    console.log(query)

  let result = await database.query(query)

  return result[0]
}

function pointFromLatLng(lat, lng) {

  let point = {
    type: 'Point',
    coordinates: [lat, lng],
    crs: { type: 'name', properties: { name: 'EPSG:4326'} }
  }

  return point

}

export async function setPositionFromLatLng(account) {

  let point = pointFromLatLng(account.latitude, account.longitude)

  account.position = point

  await account.save()

  return models.Account.findOne({ where: { id: account.id }})

}

export async function findByEmail(email) {

  return models.Account.findOne({ where: { email }});

}

export async function updateAccount(account, payload) {

  if (!account) {

    return {

      success: false,

      error: 'account not found'

    }

  }

  let updateAttrs: any = Object.assign(payload, {});

  log.info('account.update', updateAttrs)

  if (updateAttrs.physical_address) {

    try {

      let geocodeResult = await geocoder.geocodeFull(updateAttrs.physical_address, account.id);

      let city = geocoder.parseCity(geocodeResult);
      let state = geocoder.parseState(geocodeResult);
      let country = geocoder.parseCountry(geocodeResult);

      let geolocation = geocodeResult.geometry.location

      updateAttrs.latitude = geolocation.lat;
      updateAttrs.longitude = geolocation.lng;
      updateAttrs.position = pointFromLatLng(geolocation.lat, geolocation.lng)
      updateAttrs.city = city.long_name;
      updateAttrs.state = state.short_name;
      updateAttrs.country = country.short_name;

    } catch (error) {

      log.error('error geocoding address', error.message);

    }

  }

  if (updateAttrs.ambassador_email) {
    let ambassadorAccount = await models.Account.findOne({
      where: {
        email: updateAttrs.ambassador_email
      }
    });

    if (!ambassadorAccount) {
      throw new Error('ambassador email does not exist');
    }

    let [ambassador] = await models.Ambassador.findOrCreate({
      where: { account_id: ambassadorAccount.id },
      defaults: {
        account_id: ambassadorAccount.id 
      }
    })

    if (ambassador) {
      log.info('ambassador.found', { ambassador })

      updateAttrs['ambassador_id'] = ambassador.id;

      let channel = await awaitChannel();

      await channel.publish('anypay', 'ambassador_set', Buffer.from(JSON.stringify({
        account_id: account.id,
        ambassador_id: ambassador.id,
        ambassador_email: updateAttrs.ambassador_email
      })));

    }

  }

  delete updateAttrs['ambassador_email'];

  if (updateAttrs.remove_ambassador) {
    updateAttrs['ambassador_id'] = null
    delete updateAttrs['remove_ambassador']
  }

  await account.update(updateAttrs)

  return account

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

    events.emit('account.created', account)

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

export async function setAddressScalar(account_id: number, currency: string, price_scalar: number) {

  log.info('address.scalar.set', { account_id, currency, price_scalar })

  let result = await models.Address.update({
    price_scalar 
  }, {
    where: {
      account_id,
      currency
    }
  })

}

export async function setAddressNote(account_id: number, currency: string, note: string) {

  await models.Address.update({
    note 
  }, {
    where: {
      account_id,
      currency
    }
  })

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

