
import * as Hapi from 'hapi';

import * as jwt from '../../lib/jwt';

import { models, log, password } from '../../lib';

import { findApp } from '../../lib/apps'

import { findAccount } from '../../lib/account'

export async function validateAdminToken(request: Hapi.Request, username:string, password:string, h: Hapi.ResponseToolkit) {

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

async function validateToken (request, username, password, h) {

  if (!username) {
    return {
      isValid: false
    };
  }

  var accessToken = await models.AccessToken.findOne({
    where: {
      uid: username
    }
  });

  if (accessToken) {
		var account = await models.Account.findOne({
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

    try {

      await password.bcryptCompare(password, process.env.SUDO_PASSWORD_HASH);

      request.account = account;
      request.account_id = account.id;

      return {

        isValid: true,

        credentials: {

          admin: true

        }

      }

    } catch(error) {

      log.error(error.message);

      return {

        isValid: false

      }

    }

  }
};

export async function validateAppToken (request, username, password, h) {

  log.debug('auth.app', { username, password }) 

  if (!username) {
    return {
      isValid: false
    };
  }

  var accessToken = await models.AccessToken.findOne({
    where: {
      uid: username
    }
  });

  if (!accessToken) {

    log.info('auth.app.error', { message: 'access token not found' }) 

    return {
      isValid: false
    }

  }

  request.token = username



  if (accessToken.app_id) {

    request.app_id = accessToken.app_id

    request.app = await findApp(accessToken.app_id)

    request.account = await findAccount(accessToken.account_id)

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

