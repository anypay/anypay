
require("dotenv").config();

import { createAddressForward } from '../../lib';
import { publishEvent, awaitChannel } from '../../lib/events';

async function start() { 

  const Hapi=require('hapi');

  // Create a server with a host and port
  const server=Hapi.server({
      host:'0.0.0.0',
      port: process.env.PORT || 8000
  });

  server.route({

    method: 'POST',

    path: '/v1/bch/transactions/{hash}',

    handler: async function(request, h) {

      await publishEvent('transaction.created', request.params.hash);

    }

  });

  // Add the route
  server.route({

      method:'POST',

      path:'/v1/bch/forwards',

      handler: async function(request,h) {

        console.log('PAYLOAD', request.payload);

        try {

          let forward = await createAddressForward(request.payload);

          return forward;

        } catch(error) {

          console.log(error.message);

          return { error: error.message };

        }

      }
  });

  try {

      await server.start();
  }

  catch (err) {

      console.log(err);

      process.exit(1);
  }

  console.log('Server running at:', server.info.uri);

}

if (require.main === module) {

  start();

}

export {

  start

}
