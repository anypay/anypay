
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
      description: 'Register A New Account',
      tags: ['api', 'v1', 'registration'],
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().required()
        })
      }
      //TODO: ADD RESPONSE SCHEMA
    },
  });

  server.route({
    method: "POST",
    path: "/v1/api/account/login",
    handler: v1.AccountLogins.create,
    options: {
      description: 'Start A New Session And Receive An Auth Token',
      tags: ['api', 'v1', 'login'],
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().required()
        })
      },
      //TODO: ADD RESPONSE SCHEMA
    },
  });

  server.route({
    method: "POST",
    path: "/v1/api/account/password-reset",
    handler: v1.PasswordResets.create,
    options: {
      description: 'Request A Password Reset Email',
      tags: ['api', 'v1', 'login'],
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required()
        })
      },
      //TODO: ADD RESPONSE SCHEMA
    },
  });

  server.route({
    method: "GET",
    path: "/v1/api/account/my-account",
    options: {
      description: 'Get Your Account Profile',
      tags: ['api', 'v1', 'account'],
      auth: "jwt"
      //TODO: ADD RESPONSE SCHEMA
    },
    handler: v1.MyAccount.show
  });

  server.route({
    method: 'GET',
    path: '/v1/api/webhooks',
    options: {
      description: 'List Payment Notification Webhooks',
      tags: ['api', 'v1', 'webhooks'],
      auth: "jwt"
      //TODO: ADD RESPONSE SCHEMA
    },
    handler: v1.Webhooks.index
  }); 

  server.route({
    method: 'GET',
    path: '/v1/api/account/payments',
    options: {
      description: 'List Payments Received',
      tags: ['api', 'v1', 'payments'],
      auth: "jwt",
      validate: {
        query: Joi.object({
          limit: Joi.number().optional(),
          offset: Joi.number().optional()
        }),
        headers: Joi.object({
          'authorization': Joi.string().required()
        }).unknown()
      },
      response: {
        schema: v1.Payments.Schema.listPayments
      }
    },
    handler: v1.Payments.index
  }); 

  server.route({
    method: 'POST',
    path: '/v1/api/webhooks/{invoice_uid}/attempts',
    options: {
      description: 'Retry Webhook Notification',
      tags: ['api', 'v1', 'webhooks'],
      auth: "jwt"
      //TODO: ADD RESPONSE SCHEMA
    },
    handler: v1.Webhooks.attempt
  }); 

  server.route({
    method: "POST",
    path: "/v1/api/invoices",
    handler: v1.Invoices.create,
    options: {
      description: 'Create New Invoice',
      tags: ['api', 'v1', 'invoices'],
      auth: "jwt",
      validate: {
        payload: Joi.object({
          amount: Joi.number().min(0).required(),
          denomination: Joi.string().optional(),
          currency: Joi.string().optional()
        })
      },
      //TODO: ADD RESPONSE SCHEMA
    },
  });

  server.route({
    method: 'POST',
    path: '/v1/api/account/addresses',
    options: {
      description: 'Set Wallet Address',
      tags: ['api', 'v1', 'addresses'],
      auth: "jwt",
      validate: {
        payload: Joi.object({
          currency: Joi.string().required(),
          value: Joi.string().required(),
          label: Joi.string().optional()
        })
      },
      response: {
        schema: Joi.object({
          address: Joi.object({
            currency: Joi.string().required(),
            value: Joi.string().required(),
            label: Joi.string().optional()
          })
        })
      }
    },
    handler: v1.Addresses.update
  }); 

}
