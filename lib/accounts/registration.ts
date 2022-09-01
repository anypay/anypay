
import { Request } from 'hapi'

import { Account } from '../account'

import * as geoip from 'geoip-lite'

import * as slack from '../slack/notifier'

import * as utils from '../utils'

import { models } from '../models'

import { log } from '../log'

interface NewAccount {
  email: string;
  password: string;
}

export async function registerAccount(params: NewAccount): Promise<Account> {

  let { email, password } = params;

  log.info('account.register', {email});

  let passwordHash = await utils.hash(password);

  log.info('account.register.password.hash', { passwordHash })

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

    log.info(`account.login.notfound`, { email: params.email });

    throw new Error('invalid login')
  }

  try {

    await utils.bcryptCompare(params.password, account.password_hash);

  } catch(error) {

    log.info(`account.login.error.password`, { email: params.email });

    throw new Error('invalid login')

  }

  log.info('account.login', { account_id: account.id })

  return new Account(account)

}

