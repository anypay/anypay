
import { Request } from 'hapi'

import { log } from '../../lib/log'

import { authorizeAccount } from '../../lib/auth'

export async function authorizeRequest(request: Request) {

  let token = parseTokenFromRequest(request)

  let account = await authorizeAccount(token)

  return account

}

function parseTokenFromRequest(request: Request) {

  var authorization = request.headers['authorization'] || request.headers['Authorization']

  let token = authorization.split(" ")[1]

  return token

}

export function useJWT() {

  return {

    validate: async (request, token, h) => {

      try {

        let account = await authorizeAccount(token)

        const credentials = { token };

        const artifacts = { account }

        request.account = account

        request.token = token

        return {

          isValid: true,

          credentials,
          
          artifacts

        }

      } catch(error) {

        log.error('jwt.auth.error', error)

        return h.unauthenticated(error)

      }

    }

  }

}


