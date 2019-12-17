
import { models, log, password } from '../../lib';

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

export { validateToken }

