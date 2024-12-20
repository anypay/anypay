
import * as Hapi from '@hapi/hapi';

import * as jwt from '@/lib/jwt';

import { log } from '@/lib';

import { Request } from '@hapi/hapi';
import AuthenticatedRequest from '@/server/auth/AuthenticatedRequest';
import prisma from '@/lib/prisma';

export async function validateAdminToken(request: Request, username:string, password:string, h: Hapi.ResponseToolkit) {

  try {

    let token = await jwt.verifyToken(username);

    return {
      isValid: true,
      token
    }

  } catch(error) {

    return {
      isValid: false
    }

  }
}

async function validateToken (request: AuthenticatedRequest, username: string, password: string) {

  if (!username) {
    return {
      isValid: false
    };
  }

  var accessToken = await prisma.access_tokens.findFirst({
    where: {
      uid: username
    }
  });

  if (accessToken) {

    var account = await prisma.accounts.findFirstOrThrow({
      where: {
        id: accessToken.account_id
      }
    })

		request.account = account;

    request.account_id = accessToken.account_id;

    return {
      isValid: true,
      credentials: { accessToken: accessToken }
    }

  } else {



      return {

        isValid: false

      }


  }
};

export async function validateAppToken (request: AuthenticatedRequest, username: string, password: string) {

  log.debug('auth.app', { username, password }) 

  if (!username) {
    return {
      isValid: false
    };
  }

  var accessToken = await prisma.access_tokens.findFirst({
    where: {
      uid: username
    }
  })

  if (!accessToken) {

    log.info('auth.app.error', { message: 'access token not found' }) 

    return {
      isValid: false
    }

  }

  request.token = username



  if (accessToken.app_id) {

    request.app_id = accessToken.app_id

    request.app = await await prisma.apps.findFirstOrThrow({
      where: {
        id: accessToken.app_id
      }
    })

    request.account = await prisma.accounts.findFirstOrThrow({
      where: {
        id: accessToken.account_id
      }
    })

    request.token = username

    return {
      isValid: true,
      credentials: { accessToken: accessToken }
    }

  } else {

    return {
      isValid: false
    }

  }

};

export { validateToken }

