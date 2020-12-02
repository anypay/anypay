
import { log, events, models } from '../../../lib';
import { notify } from '../../../lib/slack/notifier';
var geoip = require('geoip-lite');

import * as Boom from 'boom'

module.exports.create = async (request, h) => {
  console.log("CREATE ACCESS TOKEN")

  try {

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

    let loginLog = await models.Login.create(login)

    console.log('login', loginLog.toJSON())

    let event = await events.record({
      event: 'user.login',
      payload: {
        ip,
        token: token.uid
      },
      account_id: token.account.id,
    })

    notify(JSON.stringify(Object.assign(event.toJSON(), {
      email: token.account.email 
    })), 'events');

    return {

      uid: token.uid,

      account_id: token.account_id,

      email: request.auth.credentials.account.email

    };

  } catch(error) {

    console.log('error creating access token', error.message)
    log.error(error)

    return Boom.badRequest(error.message)

  }
}

