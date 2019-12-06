require("dotenv").config()

import { hash, bcryptCompare } from '../password';

import { log,models } from '../index';

export async function validateSudoPassword(request, username, password, h) {

  log.info('validate sudo password');

  if (!username) {

    return {

      isValid: false

    }

  }

  try {

    await bcryptCompare(username, process.env.SUDO_PASSWORD_HASH);

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

      await bcryptCompare(password, process.env.SUDO_PASSWORD_HASH);

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

