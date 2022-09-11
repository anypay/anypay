
import { Server } from 'hapi'

import { start } from './main'

import * as Joi from 'joi'

export const plugin = ((server, options) => {

  const handlers = {

    autosell: {

      index: (core) => {

        return async function(req, h) {

          let account = await core.models.KrakenAccount.findOne({
            where: { account_id: req.account.id}
          })

          let orders = await core.models.Event.findAll({
            where: {
              type: 'kraken.order.created',
              account_id: req.account.id
            },
            order: [['createdAt', 'desc']]
          })

          orders = orders.map(order => {

            return Object.assign(order.payload.result, {
              createdAt: order.createdAt
            })
          })

          let currencies = account ? account.autosell : []

          return {

            orders,
            
            currencies

          }

        }

      }
    }
  }

  return {

    name: 'kraken',

    register: function(server: Server, options, next) {

      options.core.log.info('server.plugins.register.kraken')

      start()

      server.route({
        method: "GET",
        path: "/v1/api/kraken/autosell",
        handler: handlers.autosell.index(options.core),
        options: {
          tags: ['api', 'exchange', 'kraken', 'v1'],
          auth: "jwt",
          response: {
            failAction: 'log',
            schema: Joi.object({
              enabled: Joi.boolean().required(),
              orders: Joi.array().items(Joi.object({
                txid: Joi.array().required(),
                descr: Joi.object({
                  order: Joi.string().required()
                }).required()
              })).required()
            })
          }
        },
      })

      server.route({
        method: "GET",
        path: "/v0/api/kraken/autosell",
        handler: handlers.autosell.index(options.core),
        options: {
          tags: ['api', 'exchange', 'kraken', 'v1'],
          auth: "token",
          response: {
            failAction: 'log',
            schema: Joi.object({
              enabled: Joi.boolean().required(),
              orders: Joi.array().items(Joi.object({
                txid: Joi.array().required(),
                descr: Joi.object({
                  order: Joi.string().required()
                }).required()
              })).required()
            })
          }
        },
      })

    }

  }

})()

