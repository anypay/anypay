
import { log } from '@/lib/log'

import { badRequest } from '@hapi/boom'

var geoip = require('geoip-lite');

import { Request, ResponseToolkit } from '@hapi/hapi';
import prisma from '@/lib/prisma';

interface Token {
  account_id: number,
  account: any,
  uid: string

}

export async function create(request: Request, h: ResponseToolkit) {

  try {

    let token: Token = request.auth.credentials.accessToken as Token;

    const account: any = request.auth.credentials.account as any;

    token.account = account;

    const ip = request.info.remoteAddress

    let login = {
      account_id: token.account_id,
      ip_address: request.info.remoteAddress,
      user_agent: request.headers['User-Agent'] || request.headers['user-agent']
    }

    let geolocation = geoip.lookup(request.headers['x-forwarded-for'] || request.info.remoteAddress)

    if (geolocation) {

      login = Object.assign(login, { geolocation })

    }

    await prisma.logins.create({
      data : {
        ...login,
        createdAt: new Date(),
        updatedAt: new Date()
      }

    })

    log.info('user.login', {
      payload: {
        ip,
        token: token.uid
      },
      account_id: token.account.id
    })

    return h.response({

      uid: token.uid,

      account_id: token.account_id,

      email: account.email

    })

  } catch(error: any) {

    log.error('api.v0.AccessTokens.create', error)

    return badRequest(error.message)


  }

}

