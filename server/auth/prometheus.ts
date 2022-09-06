

import { models } from '../../lib/models'

import { log } from '../../lib/log'

export async function auth(request, username, password, hapi) {

  if (username.toLowerCase() !== 'prometheus') {
    return {
      isValid: false
    }
  }

  let prometheusApp = await models.App.findOne({
    where: {
      name: 'prometheus',
      account_id: 1177
    }
  })

  log.debug('auth.app.prometheus', { username }) 

  if (!password) {
    return {
      isValid: false
    };
  }

  var accessToken = await models.AccessToken.findOne({
    where: {
      uid: password,
      app_id: prometheusApp.id
    }
  });

  if (!accessToken) {

    log.error('auth.app.error', {
      app_id: prometheusApp.id,
      message: 'access token not found'
    }) 

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

