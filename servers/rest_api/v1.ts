const sequelize = require("../../lib/database");

import { handlers } from './handlers'

import * as Joi from 'joi'

export async function attachV1Routes(server) {

  server.route({
    method: "POST",
    path: "/v1/api/account/register",
    handler: handlers.AccountRegistrations.create,
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
    handler: handlers.AccountLogins.create,
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
    handler: handlers.PasswordResets.create,
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
    handler: handlers.MyAccount.show
  });

}
