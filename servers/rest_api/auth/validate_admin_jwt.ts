
import * as jwt from '../../../lib/jwt';

import { Request, ResponseToolkit } from 'hapi';

export async function validateAdminJWT(request: Request, username:string, password:string, h: ResponseToolkit) {

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

