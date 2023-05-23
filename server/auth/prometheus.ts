

import { App } from '../../lib/apps'

import { AccessToken } from '../../lib/access_tokens'

import { findOne } from '../../lib/orm'

import { log } from '../../lib/log'

export async function auth(request, username, password, hapi) {

  if (username.toLowerCase() !== 'prometheus') {
    return {
      isValid: false
    }
  }

  const prometheusApp: App = await findOne<App>(App, {
    where: {
      name: 'prometheus',
      account_id: 0
    }
  })

  log.debug('auth.app.prometheus', { username }) 

  if (!password) {
    return {
      isValid: false
    };
  }

  const accessToken: AccessToken = await findOne<AccessToken>(AccessToken, {
    where: {
      uid: password,
      app_id: prometheusApp.get('id')
    }
  });

  if (!accessToken) {

    log.error('auth.app.error', new Error('access token not found'))

    return {
      isValid: false
    }

  }

  return {

    isValid: true,

    credentials: {

      accessToken

    }

  }

}

