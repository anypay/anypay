require("dotenv").config()

import { log } from './log';

import { models } from './models'

import { Account, findAccount } from './account'

import { verifyToken } from './jwt'

import { compare } from './bcrypt'

export async function validateSudoPassword(request, username, password, h) {

  log.info('validate sudo password');

  if (!username) {

    return {

      isValid: false

    }

  }

  try {

    await compare(username, process.env.SUDO_PASSWORD_HASH);

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



export async function validateToken(request, username, password, h) {

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

      await compare(password, process.env.SUDO_PASSWORD_HASH);

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

export async function authorizeAccount(token: string): Promise<Account> {

  let verified = await verifyToken(token)

  return findAccount(verified.account_id)

}

