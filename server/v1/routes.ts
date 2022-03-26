require('dotenv').config()

const sequelize = require("../../lib/database");

import { v1 } from '../handlers'

import { useJWT } from '../auth/jwt'

const AuthBearer = require('hapi-auth-bearer-token');

import * as Joi from '@hapi/joi'

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
      }
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
    method: 'GET',
    path: '/v1/api/account/payments',
    options: {
      auth: "jwt",
      validate: {
        query: Joi.object({
          limit: Joi.number().optional(),
          offset: Joi.number().optional()
        })
      },
      response: {
        failAction: 'log',
        schema: v1.Payments.Schema.listPayments
      }
    },
    handler: v1.Payments.index
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

  server.route({
    method: "GET",
    path: "/v1/api/invoices/{invoice_uid}/events",
    handler: v1.InvoiceEvents.index,
    options: {
      auth: "jwt",
      validate: {
        params: Joi.object({
          invoice_uid: Joi.string().required()
        }),
        query: Joi.object({
          order: Joi.string().valid('asc', 'desc').optional()
        })
      },
      response: {
        schema: Joi.object({
          invoice_uid: Joi.string().required(),
          events: Joi.array().items(Joi.object({
            id: Joi.number().required(),
            account_id: Joi.number().optional(),
            type: Joi.string().required(),
            payload: Joi.object().optional(),
            createdAt: Joi.date().required(),
            updatedAt: Joi.date().required()
          }))
        })
      }
    },
  });

  server.route({
    method: "GET",
    path: "/v1/api/account/events",
    handler: v1.AccountEvents.index,
    options: {
      auth: "jwt",
      response: {
        schema: Joi.object({
          account_id: Joi.number().required(),
          events: Joi.array().items(Joi.object({
            id: Joi.number().required(),
            account_id: Joi.number().optional(),
            type: Joi.string().required(),
            payload: Joi.object().optional(),
            createdAt: Joi.date().required(),
            updatedAt: Joi.date().required()
          }))
        })
      }
    },
  });

  server.route({
    method: 'POST',
    path: '/v1/api/account/addresses',
    options: {
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
