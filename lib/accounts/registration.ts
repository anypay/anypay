
import { Request } from '@hapi/hapi'

import { accounts as Account } from '@prisma/client'

import * as geoip from 'geoip-lite'

import * as slack from '../slack'

import * as utils from '../utils'

import { log } from '../log'

import { compare } from '../bcrypt'
import prisma from '../prisma'

interface NewAccount {
  email: string;
  password: string;
}

export async function registerAccount(params: NewAccount): Promise<Account> {

  let { email, password } = params;

  log.info('account.register', {email});

  let passwordHash = await utils.hash(password);

  log.debug('account.register.password.hash', { passwordHash })

  var isNew = false;

  var account = await prisma.accounts.findFirst({
    where: {
      email
    }
  })

  if (!account) {

    isNew = true
    account = await prisma.accounts.create({
      data: {
        email,
        password_hash: String(passwordHash),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
  }

  if (!isNew) {

    throw new Error(`account already registered with email ${params.email}`)

  }

  const { id } = account

  log.info('account.created', { id, email })

  return account

}

export async function geolocateAccountFromRequest(account: Account, request: Request) {

  let geoLocation = geoip.lookup(request.headers['x-forwarded-for'] || request.info.remoteAddress)

  if (geoLocation) {

    let userLocation = utils.toKeyValueString(Object.assign(geoLocation, { ip: request.info.remoteAddress }))

    slack.notify(`${account.email} registerd from ${userLocation}`);

    await prisma.accounts.update({
      where: {
        id: account.id
      },
      data: {
        registration_geolocation: userLocation
      }
    
    })

  } else {

    slack.notify(`${account.email} registerd from ${request.info.remoteAddress}`);

  }

  await prisma.accounts.update({
    where: {
      id: account.id
    },
    data: {
      registration_ip_address: request.info.remoteAddress
    }
  
  })

}

export class AccountAlreadyRegisteredError implements Error {

  name = 'AccountAlreadyRegisteredError'

  message = 'account with email already registered'

  constructor(email: string) {

    this.message = `account with email ${email} already registered`

  }

}

export async function loginAccount(params: NewAccount): Promise<Account> {


  const account = await prisma.accounts.findFirstOrThrow({
    where: {
      email: params.email
    }
  
  })

  if (!account.password_hash) {

    log.info(`account.login.notfound`, { email: params.email });

    throw new Error('invalid login')
  }

  try {

    await compare(params.password, String(account.password_hash));

  } catch(error) {

    log.info(`account.login.error.password`, { email: params.email });

    throw new Error('invalid login')

  }

  log.info('account.login', { account_id: account.id })

  return account

}

