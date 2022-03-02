
import { Request } from 'hapi'

import { Account } from '../account'

import * as geoip from 'geoip-lite'

import * as slack from '../slack/notifier'

import * as utils from '../utils'

import { models } from '../models'

import { logInfo } from '../logger'

interface NewAccount {
  email: string;
  password: string;
}

export async function registerAccount(params: NewAccount): Promise<Account> {

  let { email, password } = params;

  logInfo('account.register', {email});

  let passwordHash = await utils.hash(password);

  logInfo('account.register.password.hash', { passwordHash })

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

  logInfo('account.created', {account})

  return new Account(account);

}

export async function geolocateAccountFromRequest(account: Account, request: Request) {

  let geoLocation = geoip.lookup(request.headers['x-forwarded-for'] || request.info.remoteAddress)

  if (geoLocation) {

    let userLocation = utils.toKeyValueString(Object.assign(geoLocation, { ip: request.info.remoteAddress }))

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

    logInfo(`account.login.notfound`, { email: params.email });

    throw new Error('invalid login')
  }

  try {

    await utils.bcryptCompare(params.password, account.password_hash);

  } catch(error) {

    logInfo(`account.login.error.password`, { email: params.email });

    throw new Error('invalid login')

  }

  return new Account(account)

}

