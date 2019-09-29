require('dotenv').config();

import * as Hapi from 'hapi'
import * as Boom from 'boom'
import * as Joi from 'joi'

import { amqp, models, log } from '../../lib';
import { validateToken } from '../rest_api/auth/validate_token';

const J = Joi.extend(require('joi-phone-number'));

/*
 * Environment:
 *   - TIPJAR_HTTP_PORT
 *   - TIPJAR_WS_PORT
 *
 */

export async function start() {

  const server = new Hapi.Server({
    host: "0.0.0.0",
    port: process.env.TIPJAR_HTTP_PORT || process.env.PORT || 3000,
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

  server.auth.strategy("token", "basic", { validate: validateToken });

  server.route({
    method: 'POST',
    path: '/tipjar/claims',
    handler: async (req, h) => {

      // 1) validate access token
      // 2) check that is valid cointext phone number
      // 3) record claim for tipjar, publish event
      // 5) reply to claimee

      try {

        let record = await models.TipjarClaim.create({

          account_id: req.account.id,

          address: req.payload.address,

          address_type: 'cointext_phone_number'

        });

        return record;

      } catch(error) {

        return Boom.badRequest(error.message);
      }

    },
    options: {

      auth: 'token',

      validate: {
        payload: {
          address: J.string().phoneNumber().required(),
          address_type: Joi.string().required()
        }
      }
    }
  });

  await server.start();

  log.info(`Server running on ${server.info.uri}`);

}

if (require.main === module) {

  start();

}

