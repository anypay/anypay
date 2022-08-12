require('dotenv').config()

const socketio = require('socket.io')

import { Server } from '@hapi/hapi'

const AuthBearer = require('hapi-auth-bearer-token');

import { authenticate } from './auth'

import { log } from '../../lib/log'

import { useJWT } from '../../server/auth/jwt'

import { bind, unbind, Context } from './socket.io/amqp_queue_socket_binding'

import { config } from '../../lib/config'

import * as Joi from '@hapi/joi';

import { failAction } from '../../server/handlers'

import { findOrCreateWalletBot, getAccessToken } from './'

import { badImplementation } from '@hapi/boom'

import { listSockets, setSocket, removeSocket, getSocket, handlers } from './sockets'

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

          socket.onAny((event, ...args) => {

            //console.log(`got ${event} with ${args}`);
          });

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

          console.error('io.connection.error', error)

        }


      })

      const base = '/v1/api/apps/wallet-bot'

      server.route({
        path: `${base}`,
        method: 'GET',
        handler: async (req, h) => {

          try {

            const walletBot = await findOrCreateWalletBot(req.account)

            const accessToken = await getAccessToken(walletBot)

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

              balances

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

    }

  }

})()

if (require.main === module) {

  (async () => {

    const server = new Server({
      host: config.get('HOST'),
      port: config.get('PORT'),
      routes: {
        cors: true
      }
    });

    await server.register(AuthBearer)

    server.auth.strategy("jwt", "bearer-access-token", useJWT());

    await server.register(plugin)

    log.info('wallet-bot.socket.io.server.start')

    await server.start();
    
    log.info('wallet-bot.socket.io.server.started', server.info)



  })()

}
