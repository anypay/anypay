

import { App } from '../../lib/apps'

import { findOne } from '../../lib/orm'

import { log } from '../../lib/log'

import prisma from '../../lib/prisma'

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

  if (!prometheusApp) {

    log.error('auth.app.error', new Error('prometheus app not found'))

    return {
      isValid: false
    }

  }

  if (!password) {
    return {
      isValid: false
    };
  }

  try {

    const accessToken = await prisma.access_tokens.findFirst({
      where: {
        uid: password,
        app_id: prometheusApp.get('id')

      }
    })

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

  } catch(error) {

    log.error('auth.app.error', error)

    return {
      isValid: false
    }

  }


}

