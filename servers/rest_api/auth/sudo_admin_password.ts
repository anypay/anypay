
require("dotenv").config()

import { hash, bcryptCompare } from '../../../lib/password';

import { log } from '../../../lib';

export async function validateSudoPassword(request, username, password, h) {

  log.info('validate sudo password');

  if (!username) {

    return {

      isValid: false

    }

  }

  if (bcryptCompare(username, process.env.SUDO_PASSWORD_HASH)) { 

    return {

      isValid: true,

      credentials: {

        admin: true

      }

    }

  } else {

    return {

      isValid: false

    }

  }

}
