
import { Request } from 'hapi'

import { Account } from './account'

import * as geoip from 'geoip-lite'

import * as slack from './slack'

import { hash } from './bcrypt'

import { models } from './models'

import { log } from './log'

import { compare } from './bcrypt'

interface NewAccount {
  email: string;
  password: string;
}

function toKeyValueString(json: any): string {

  let entries = Object.entries(json)

  return entries.reduce((str, entry) => {

    return `${str}${entry[0]}=${entry[1]} `

  }, '')

}




export async function registerAccount(params: NewAccount): Promise<Account> {

  let { email, password } = params;

  log.info('account.register', {email});

  let passwordHash = await hash(password);

  log.debug('account.register.password.hash', { passwordHash })

  let [account, isNew] = await models.Account.findOrCreate({

    where: { email },

    defaults: {

      email,
     
      password_hash: passwordHash

    }
  });

  if (!isNew) {

    throw new AccountAlreadyRegisteredError(params.email)

  }

  const { id } = account

  log.info('account.created', { id, email })

  return new Account(account);

}

export async function geolocateAccountFromRequest(account: Account, request: Request) {

  let geoLocation = geoip.lookup(request.headers['x-forwarded-for'] || request.info.remoteAddress)

  if (geoLocation) {

    let userLocation = toKeyValueString(Object.assign(geoLocation, { ip: request.info.remoteAddress }))

    slack.notify(`${account.email} registerd from ${userLocation}`);

    await account.set('registration_geolocation', geoLocation)

  } else {

    slack.notify(`${account.email} registerd from ${request.info.remoteAddress}`);

  }

  await account.set('registration_ip_address', request.info.remoteAddress)

  account.save()
 

}

export class AccountAlreadyRegisteredError implements Error {

  name = 'AccountAlreadyRegisteredError'

  message = 'account with email already registered'

  constructor(email: string) {

    this.message = `account with email ${email} already registered`

  }

}

export async function loginAccount(params: NewAccount): Promise<Account> {

  var account = await models.Account.findOne({
    where: {
      email: params.email
    }
  });

  if (!account) {

    log.info(`account.login.notfound`, { email: params.email });

    throw new Error('invalid login')
  }

  try {

    let valid = await compare(params.password, account.password_hash);

    if (!valid) {
      
      throw new Error('invalid login')

    }

  } catch(error) {

    log.info(`account.login.error.password`, { email: params.email });

    throw new Error('invalid login')

  }

  log.info('account.login', { account_id: account.id })

  return new Account(account)

}

