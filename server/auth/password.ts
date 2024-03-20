
import { models } from '../../lib/models'

import { log } from '../../lib/log'

import * as AccountLogin from '../../lib/account_login'
import { Request, ResponseToolkit } from '@hapi/hapi';

export async function validate(request: Request, username: string, password: string, h: ResponseToolkit) {

  try {

    if (!username || !password) {

      return {
        isValid: false
      };
    }

    var account = await models.Account.findOne({
      where: {
        email: username.toLowerCase()
      }
    });

    if (!account) {

      return {
        isValid: false
      }
    }


    var accessToken = await AccountLogin.withEmailPassword(username, password);

    if (accessToken) {

      return {
        isValid: true,
        credentials: { accessToken, account }
      };

    } else {

      return {isValid: false}

    }

  } catch(error: any) {

    log.error('auth.passwords.validate.error', error);

    return {isValid: false}

  }

};
