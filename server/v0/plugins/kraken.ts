
import { Server } from '@hapi/hapi'

import { create, show, destroy } from '../handlers/kraken_api_keys'

export async function register(server: Server) {

  server.route({
    method: 'POST',
    path: '/kraken_api_keys',
    handler: create,
    options: {
      auth: "token"
    }
  }); 

  server.route({
    method: 'GET',
    path: '/kraken_api_keys',
    handler: show,
    options: {
      auth: "token"
    }
  }); 

  server.route({
    method: 'DELETE',
    path: '/kraken_api_keys',
    handler: destroy,
    options: {
      auth: "token"
    }
  }); 



 return server

}
