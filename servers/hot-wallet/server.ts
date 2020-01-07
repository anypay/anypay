require('dotenv').config();
import * as Hapi from "hapi";
import * as wallet from '../../plugins/bch/wallet';

const Joi = require('joi');

import { log, models, auth } from '../../lib';

const kBadRequestSchema = Joi.object({
  statusCode: Joi.number().integer().required(),
  error: Joi.string().required(),
  message: Joi.string().required()
}).label('BoomError')

function responsesWithSuccess({ model }) {
  return {
    'hapi-swagger': {
      responses: {
        200: {
          description: 'Success',
          schema: model
        },
        400: {
          description: 'Bad Request',
          schema: kBadRequestSchema,
        },
        401: {
          description: 'Unauthorized',
          schema: kBadRequestSchema,
        },
      },
    },
  }
}

async function Server() {

  var server = new Hapi.Server({
    host: process.env.HOST || "0.0.0.0",
    port: 9090,
    routes: {
      cors: true,
      validate: {
        options: {
          stripUnknown: true
        }
      }
    }
  });

  await server.register(require('hapi-auth-basic'));
  server.auth.strategy("token", "basic", { validate: auth.validateToken });
  server.auth.strategy("sudopassword", "basic", { validate: auth.validateSudoPassword});

  server.route({

    method: 'POST',

    path: '/',

    config: {

      auth: 'sudopassword',

      handler: rpccall 

    }

  })

  return server;

}


if (require.main === module) {

  start();
}

async function start () {

  var server = await Server();

  // Start the server
  await server.start();

  log.info("Server running at:", server.info.uri);

}

export async function rpccall( req, h){

  let payload = JSON.parse(Object.keys(req.payload)[0])

  let result:any = { "id" : payload.id }

  switch (payload.method){

    case "getbalance": 
       result.result = await wallet.getbalance()
       break
     case "getaddress": 
       result.result = await wallet.getaddress()
       break
     case "getaddressesbyaccount": 
       result.result = [await wallet.getaddress()]
       break
    case "sendtoaddress": 
       result.result = await wallet.sendtoaddress(payload.params)
       break
    case "sendtomany":
       result.result = await wallet.sendtomany(payload.params)
       break
    case "listunspent":
       result.result = await wallet.listunspent()
       break
    case "sendfrom":
       result.result = await wallet.sendFrom(payload.params)
       break
    case "paytomany":
       result.result = await wallet.sendtomany(payload.params)
       break
    default: break

  }

  log.info("result", result)

  return result 

}

export { Server, start }
