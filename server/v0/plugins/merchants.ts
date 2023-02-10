
import { Server } from '@hapi/hapi'

import * as Merchants from '../handlers/merchants'

export async function register(server: Server) {

  server.route({
    method: 'GET',
    path: '/merchants/{account_id}',
    handler: Merchants.show
  });

  return server

}
