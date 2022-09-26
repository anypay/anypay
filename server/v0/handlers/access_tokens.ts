
import { models } from '../../../lib';

import { log } from '../../../lib/log'

var geoip = require('geoip-lite');

export async function create(request, h) {

  let token = request.auth.credentials.accessToken;

  token.account = request.auth.credentials.account;

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

  await models.Login.create(login)

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

    email: request.auth.credentials.account.email

  })

}

