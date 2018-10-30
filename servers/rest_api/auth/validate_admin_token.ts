import { models } from '../../../lib';

export async function validateAdminToken (request, username, password, h) {

  if (!username) {

    return {

      isValid: false

    };

  }

  var accessToken = await modelsAccessToken.findOne({

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

    if (account.is_admin) {

      return {

        isValid: true,

        credentials: { accessToken: accessToken }

      }

    } else {

      return isValid: false

    }

  } else {

    return {

      isValid: false

    }

  }

};

