require('dotenv').config()

const socketio = require('socket.io')

import { Server } from '@hapi/hapi'

const AuthBearer = require('hapi-auth-bearer-token');

import { authenticate } from './auth'

import { log } from '../../lib/log'

import { useJWT } from '../../server/auth/jwt'

import { bind, unbind } from './socket.io/amqp_queue_socket_binding'

import { config } from '../../lib/config'

import { findOrCreateWalletBot, getAccessToken, getPaymentCounts } from './'

import { requireHandlersDirectory } from '../../lib/rabbi_hapi'

import { listSockets, setSocket, removeSocket, getSocket } from './sockets'

import { failAction } from '../../server/handlers'

import { handlers as websocketsHandlers } from './sockets'

export const plugin = (() => {

  return {

    name: 'socket.io',

    register: async function(server: Server, options, next) {

      const path = '/v1/apps/wallet-bot'

      const io = socketio(server.listener, { path })

      log.info('socket.io.started', { path })

      io.use(async (socket, next) => {

        try {

          log.info('wallet-bot.socket.io.connecting')

          log.info('wallet-bot.socket.io.handshake', socket.handshake)

          const { address } = socket.handshake

          const { walletBot } = await authenticate(socket)

          if (!walletBot) {

            throw new Error('unauthorized')

          }

          socket.data.walletBot = walletBot

          setSocket(walletBot, socket)

          log.info('wallet-bot.socket.io.authenticated', { address, walletBot })

          socket.emit('authenticated')

          next()

        } catch(error) {

          socket.emit('error', error)

          removeSocket(socket)

        }

      })

      io.on('connection', async function(socket) {

        try {

          const { address } = socket.handshake

          log.info('wallet-bot.socket.io.connection', { address })

          const binding = await bind({ socket })

          Object.keys(websocketsHandlers).forEach(event => {

            socket.on(event, (message) => {

              if (websocketsHandlers[event]) {

                websocketsHandlers[event](socket, message)

              }
              
            })
          })

          socket.on('disconnect', () => {

            unbind(binding)

            removeSocket(socket)

            log.info('wallet-bot.socket.io.disconnect', socket.info)

            const sockets = listSockets()

            log.info('wallet-bot.socket.io.sockets', { count: sockets.length })

          })

          const sockets = listSockets()

          log.info('wallet-bot.socket.io.sockets', { count: sockets.length })

        } catch(error) {

          log.error('io.connection.error', error)

        }


      })

      const base = '/v1/api/apps/wallet-bot'

      server.route({
        path: `${base}`,
        method: 'GET',
        handler: async (req, h) => {

          try {

            const {walletBot} = await findOrCreateWalletBot(req.account)

            const accessToken = await getAccessToken(walletBot)

            const counts = await getPaymentCounts(walletBot)

            const socket = getSocket(walletBot)

            const status = socket ? 'connected' : 'disconnected'

            const wallet_bot = {

              id: walletBot.get('id'),

              status

            }

            const balances = socket ? socket.data.balances : null

            const access_token = accessToken.get('uid')

            return {

              wallet_bot,

              access_token,

              balances,

              counts

            }
           
          } catch(error) {

            log.error('apps.wallet-bot.api', error)

            return h.badImplementation(error)

          }

        },
        options: {

          auth: "jwt",

          /*response: {
            failAction,
            schema: Joi.object({
              wallet_bot: Joi.object().required(),
              access_token: Joi.string().required()
            })
          }
          */
        }
      })


      server.route({
        path: `${base}/dashboard`,
        method: 'GET',
        handler: async (req, h) => {

          try {

            const {walletBot} = await findOrCreateWalletBot(req.account)

            const accessToken = await getAccessToken(walletBot)

            const counts = await getPaymentCounts(walletBot)

            const socket = getSocket(walletBot)

            const status = socket ? 'connected' : 'disconnected'

            const wallet_bot = {

              id: walletBot.get('id'),

              status

            }

            const balances = socket ? socket.data.balances : null

            const access_token = accessToken.get('uid')

            return {

              wallet_bot,

              access_token,

              balances,

              counts

            }
           
          } catch(error) {

            log.error('apps.wallet-bot.api', error)

            return h.badImplementation(error)

          }

        },
        options: {

          auth: "app",

          /*response: {
            failAction,
            schema: Joi.object({
              wallet_bot: Joi.object().required(),
              access_token: Joi.string().required()
            })
          }
          */
        }
      })

      var handlers = requireHandlersDirectory(`${__dirname}/api/handlers`)

      server.route({
        path: `${base}/invoices`,
        method: 'POST',
        handler: handlers.Invoices.create,
        options: {
          auth: "app",
          tags: ['api', 'wallet-bot'],
          validate: {
            payload: handlers.Invoices.schema.payload,
            failAction
          },
          response: {
            failAction: 'log',
            schema: handlers.Invoices.schema.response
          }
        },
      })

      server.route({
        method: 'GET',
        path: '/v0/api/apps/wallet-bot/invoices',
        handler: handlers.Invoices.index,
        options: {
          auth: 'app'
        }
      }); 

      server.route({
        method: 'PUT',
        path: '/v1/api/apps/wallet-bot/address-balances',
        handler: handlers.AddressBalances.update,
        options: {
          auth: 'app',
          tags: ['api', 'wallet-bot'],
          validate: {
            payload: Joi.object({
              chain: Joi.string(),
              currency: Joi.string(),
              address: Joi.string(),
              balance: Joi.number()
            })
          }
        }
      }); 

      server.route({
        method: 'GET',
        path: '/v1/api/apps/wallet-bot/address-balances',
        handler: handlers.AddressBalances.index,
        options: {
          auth: 'app',
          tags: ['api', 'wallet-bot']
        }
      }); 

      server.route({
        method: 'GET',
        path: '/v1/api/apps/wallet-bot/address-balances/{chain}/{currency}/{address}',
        handler: handlers.AddressBalances.show,
        options: {
          auth: 'app',
          tags: ['api', 'wallet-bot'],
          validate: {
            params: Joi.object({
              chain: Joi.string(),
              currency: Joi.string(),
              address: Joi.string()
            })
          }
        }
      }); 

      server.route({
        method: 'DELETE',
        path: '/v1/api/apps/wallet-bot/invoices/{invoice_uid}',
        handler: handlers.V1Invoices.cancel,
        options: {
          validate: {
            params: Joi.object({
              invoice_uid: Joi.string().required()
            }).required()
          },
          auth: 'app',
          tags: ['api', 'wallet-bot'],
        }
      }); 

      server.route({
        path: `${base}/invoices`,
        method: 'GET',
        options: {
          auth: "app",
          tags: ['api', 'wallet-bot']
        },
        handler: handlers.V1Invoices.index
      })

    }

  }

})()

import { requireDirectory } from 'rabbi'
import Joi = require('joi');

const auth = requireDirectory('../../server/auth')

export async function createServer(): Promise<Server> {

  const server = new Server({
    host: config.get('HOST'),
    port: config.get('PORT'),
    routes: {
      cors: true
    }
  });

  await server.register(AuthBearer)

  await server.register(require('@hapi/basic'));

  server.auth.strategy("app", "basic", { validate: auth.Token.validateAppToken });

  server.auth.strategy("jwt", "bearer-access-token", useJWT());

  await server.register(plugin)

  return server

}

if (require.main === module) {

  (async () => {

    const server = await createServer()

    log.info('wallet-bot.socket.io.server.start')

    await server.start();
    
    log.info('wallet-bot.socket.io.server.started', server.info)

  })()

}
