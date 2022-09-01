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

import { badImplementation, badRequest } from '@hapi/boom'

import { requireHandlersDirectory } from '../../lib/rabbi_hapi'

import { listSockets, setSocket, removeSocket, getSocket, handlers } from './sockets'
import { Invoice } from '../../lib/invoices';
import { findAll } from '../../lib/orm';

import { failAction } from '../../server/handlers'

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

          Object.keys(handlers).forEach(event => {

            socket.on(event, (message) => {

              handlers[event](socket, message)
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

            return badImplementation(error)

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
        path: `${base}/unpaid`,
        method: 'GET',
        options: {
          auth: "app"
        },
        handler: async (req, h) => {

          try {

            const { app } = await findOrCreateWalletBot(req.app)

            const { status, limit, offset } = req.query

            const where = {
              app_id: app.id,
              status: 'unpaid'
            }

            const query = { where }

            if (limit) {
              query['limit'] = limit || 100
            }

            if (offset) {
              query['offset'] = offset
            }

            const invoices = await findAll<Invoice>(Invoice, query)

            return {
              app: '@wallet-bot',
              invoices: invoices.map(invoice => invoice.toJSON())
            }

          } catch(error) {

            log.error('wallet-bot.handlers.invoices.list', error)

            return badRequest(error)

          }

        }

      })

      var handlers = requireHandlersDirectory(`${__dirname}/api/handlers`)

      server.route({
        path: `${base}/invoices`,
        method: 'POST',
        handler: handlers.Invoices.create,
        options: {
          auth: "app",
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
        path: `${base}/invoices`,
        method: 'GET',
        options: {
          auth: "jwt"
        },
        handler: async (req, h) => {

          try {

            const { app } = await findOrCreateWalletBot(req.account)

            const { status, limit, offset } = req.query

            const where = {
              app_id: app.id,
              status: status || 'unpaid'
            }

            const query = { where }

            if (limit) {
              query['limit'] = limit || 100
            }

            if (offset) {
              query['offset'] = offset
            }

            const invoices = await findAll<Invoice>(Invoice, query)

            return {
              app: '@wallet-bot',
              invoices: invoices.map(invoice => invoice.toJSON())
            }

          } catch(error) {

            log.error('wallet-bot.handlers.invoices.list', error)

            return badRequest(error)

          }

        }

      
      })

    }

  }

})()

import { requireDirectory } from 'rabbi'

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

  await server.register(require('hapi-auth-basic'));

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
