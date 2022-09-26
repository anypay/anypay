

import { models } from '../../lib/models'

import { log } from '../../lib/log'
import { config } from '../../lib/config'

export async function auth(request, username, password, hapi) {

  const authRequired = config.get('prometheus_auth_required')

  console.log('__AUTH REQUIRED', authRequired)

  if (!authRequired) {

    return {
      isValid: true,

      credentials: {

        public: true
      }
    }

  }

  if (username.toLowerCase() !== 'prometheus') {
    return {
      isValid: false
    }
  }

  if (config.get('prometheus_password')) {

    if (password === config.get('prometheus_password')) {

      return {

        isValid: true,

        credentials: {

          public: true

        }

      }

    } else {

      return {

        isValid: false
        
      }

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

