
const sequelize = require("../../lib/database");

import { v1 } from '../handlers'

import { useJWT } from '../auth/jwt'

const AuthBearer = require('hapi-auth-bearer-token');

import * as Joi from 'joi'

export async function attachV1Routes(server) {

  await server.register(AuthBearer)

  server.auth.strategy("jwt", "bearer-access-token", useJWT());

  server.route({
    method: "POST",
    path: "/v1/api/account/register",
    handler: v1.AccountRegistrations.create,
    options: {
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().required()
        })
      },
    },
  });

  server.route({
    method: "POST",
    path: "/v1/api/account/login",
    handler: v1.AccountLogins.create,
    options: {
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().required()
        })
      },
    },
  });

  server.route({
    method: "POST",
    path: "/v1/api/account/password-reset",
    handler: v1.PasswordResets.create,
    options: {
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required()
        })
      },
    },
  });

  server.route({
    method: "GET",
    path: "/v1/api/account/my-account",
    options: {
      auth: "jwt"
    },
    handler: v1.MyAccount.show
  });

  server.route({
    method: 'GET',
    path: '/v1/api/webhooks',
    options: {
      auth: "jwt"
    },
    handler: v1.Webhooks.index
  }); 

  server.route({
    method: 'POST',
    path: '/v1/api/webhooks/{invoice_uid}/attempts',
    options: {
      auth: "jwt"
    },
    handler: v1.Webhooks.attempt
  }); 

  server.route({
    method: "POST",
    path: "/v1/api/invoices",
    handler: v1.Invoices.create,
    options: {
      auth: "jwt",
      validate: {
        payload: Joi.object({
          amount: Joi.number().min(0).required(),
          denomination: Joi.string().optional(),
          currency: Joi.string().optional()
        })
      },
    },
  });

}
