
import { Server } from '@hapi/hapi'

import * as Merchants from '../handlers/merchants'

export async function register(server: Server) {

  server.route({
    method: 'GET',
    path: '/merchants',
    handler: Merchants.listActiveSince
  });

  server.route({
    method: 'GET',
    path: '/merchants/{account_id}',
    handler: Merchants.show
  });

  server.route({
    method: 'GET',
    path: '/active-merchants',
    handler: Merchants.listActiveSince
  });

  server.route({
    method: 'GET',
    path: '/active-merchant-coins',
    handler: Merchants.listMerchantCoins
  });

  return server

}
