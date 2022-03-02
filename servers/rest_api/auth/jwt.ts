
import { Request } from 'hapi'

import { authorizeAccount } from '../../../lib/auth'

export async function authorizeRequest(request: Request, h) {

  let token = parseTokenFromRequest(request)

  let account = await authorizeAccount(token)

  return account

}

function parseTokenFromRequest(request: Request) {

  var authorization = request.headers['authorization'] || request.headers['Authorization']

  let token = authorization.split(" ")[1]

  return token

}

