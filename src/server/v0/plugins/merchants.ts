
import { Server } from '@hapi/hapi'

import * as Merchants from '@/server/v0/handlers/merchants'

export async function register(server: Server) {

  server.route({
    method: 'GET',
    path: '/merchants/{account_id}',
    handler: Merchants.show
  });

  return server

}
