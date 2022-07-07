
import { Server } from '@hapi/hapi'

import { requireHandlersDirectory } from '../../lib/rabbi_hapi';

import { join } from 'path'

import Joi from '@hapi/joi'

const handlers = requireHandlersDirectory(join(__dirname, './handlers'));

export async function register(server: Server) {

  /*
  server.route({
    method: 'POST',
    path: '/v0/api/apps/wallet-bot',
    handler: handlers.Apps.create,
    options: {
      auth: 'app',
      validate: {

        params: Joi.object({
          status: Joi.string().optional()
        }),
        failAction
      },
    }
  }); 
*/

  server.route({
    method: 'GET',
    path: '/v0/api/apps/wallet-bot/invoices',
    handler: handlers.Invoices.index,
    options: {
      auth: 'app',
      /*validate: {

        params: Joi.object({
          status: Joi.string().optional()
        }),
        failAction
      },
      */
    }
  }); 

}

export function failAction(request, h, error) {
  return error
}
