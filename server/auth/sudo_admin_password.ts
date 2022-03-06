
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

