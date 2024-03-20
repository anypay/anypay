
import { log } from '../../lib/log'

import prisma from '../../lib/prisma'
import { Request } from '@hapi/hapi'

export async function auth(request: Request, username: string, password: string) {

  if (username.toLowerCase() !== 'prometheus') {
    return {
      isValid: false
    }
  }

  const prometheusApp = await prisma.apps.findFirst({
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
        app_id: prometheusApp.id

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

  } catch(error: any) {

    log.error('auth.app.error', error)

    return {
      isValid: false
    }

  }


}

