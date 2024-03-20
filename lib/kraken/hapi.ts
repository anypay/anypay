
import { Server, ResponseToolkit } from '@hapi/hapi'

import { start } from './main'

import * as Joi from 'joi'
import AuthenticatedRequest from '../../server/auth/AuthenticatedRequest'
import prisma from '../prisma'

export const plugin = ((server, options) => {

  const handlers = {

    autosell: {

      index: async function(request: AuthenticatedRequest, h: ResponseToolkit) {
          const account = await prisma.krakenAccounts.findFirstOrThrow({
            where: {
              account_id: request.account.id
            }
          })

          const orderCreatedEvents = await prisma.events.findMany({
            where: {
              type: 'kraken.order.created',
              account_id: request.account.id
            },
            orderBy: {
              createdAt: 'desc'
            }
          })

          const orders = orderCreatedEvents.map((order: any) => {

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

  return {

    name: 'kraken',

    register: function(server: Server) {

      start()

      server.route({
        method: "GET",
        path: "/v1/api/kraken/autosell",
        handler: handlers.autosell.index,
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
        handler: handlers.autosell.index,
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

