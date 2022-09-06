
import { Server } from '@hapi/hapi'

import { requireHandlersDirectory } from '../../lib/rabbi_hapi';

import { join } from 'path'

const handlers = requireHandlersDirectory(join(__dirname, './handlers'));

export async function register(server: Server) {

  server.route({
    method: 'GET',
    path: '/v0/api/apps/wallet-bot/invoices',
    handler: handlers.Invoices.index,
    options: {
      auth: 'app'
    }
  }); 

}

export function failAction(request, h, error) {
  return error
}
