require('dotenv').config()

import { WebSocket } from 'ws';

import { ResponseToolkit, Server, Request } from '@hapi/hapi'

const AuthBearer = require('hapi-auth-bearer-token');

import { authenticate } from '@/apps/wallet-bot/auth'

import { log } from '@/lib/log'

import { useJWT } from '@/server/auth/jwt'

import { bind, unbind } from '@/apps/wallet-bot/socket.io/amqp_queue_socket_binding'

import { config } from '@/lib/config'

import { findOrCreateWalletBot, getAccessToken, getPaymentCounts, listLatestBalances } from '@/apps/wallet-bot'

import { listSockets, setSocket, removeSocket, getSocket } from '@/apps/wallet-bot/sockets'

import { failAction } from '@/server/handlers'

import { handlers as websocketsHandlers } from '@/apps/wallet-bot/sockets'

import * as express from 'express'

import * as handlers from '@/apps/wallet-bot/api/handlers'

interface WalletBotBalances {
      [wallet_bot_id: number]: any[]
}

const walletBotBalances: WalletBotBalances = []

function getWalletBotBalance(walletBot: any): WalletBotBalances {
  return walletBotBalances[walletBot.id] || []
}

import * as http from 'http';


export const plugin = (() => {

  return {

    name: 'socket.io',

    register: async function(server: Server) {

      // create new nodejs http server on port process.env.WALLET_BOT_WEBSOCKET_PORT

      const wsServer = http.createServer();

      const wss = new WebSocket.Server({ server: wsServer });

      // 
      
      wss.on('connection', async function (ws: WebSocket, request: express.Request) {
        try {

          log.info('wallet-bot.socket.io.connecting')

          const { walletBot } = await authenticate(ws, request)

          if (!walletBot) {

            throw new Error('unauthorized')

          }

          setSocket(walletBot, ws)
ws
          log.info('wallet-bot.socket.io.authenticated', { walletBot })

          ws.emit('authenticated')
          
          const binding = await bind({ socket: ws, walletBot });
          
          Object.keys(websocketsHandlers).forEach(event => {
            ws.on(event, (message: any) => {
              if (websocketsHandlers[event]) {
                websocketsHandlers[event](ws, message);
              }
            });
          });
          
          ws.on('close', () => {
            unbind(binding);
            removeSocket({socket: ws, walletBot});
            
            const sockets = listSockets();
            log.info('wallet-bot.socket.io.sockets', { count: sockets.length });
          });
          
          const sockets = listSockets();
          log.info('wallet-bot.socket.io.sockets', { count: sockets.length });
        } catch (error: any) {
          log.error('io.connection.error', error);
        }
      });   

      const base = '/v1/api/apps/wallet-bot'

      server.route({
        path: `${base}`,
        method: 'GET',
        handler: async (request: Request | AuthenticatedRequest, h: ResponseToolkit) => {

          try {

            const {walletBot} = await findOrCreateWalletBot((request as AuthenticatedRequest).account)

            const accessToken = await getAccessToken(walletBot)

            const counts = await getPaymentCounts(walletBot)

            const socket = getSocket(walletBot)

            const status = socket ? 'connected' : 'disconnected'

            const wallet_bot = {

              id: walletBot.id,

              status

            }

            const balances = getWalletBotBalance(walletBot)

            const access_token = accessToken.uid

            return {

              wallet_bot,

              access_token,

              balances,

              counts

            }
           
          } catch(error: any) {

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
        path: `${base}/dashboard`,
        method: 'GET',
        handler: async (req: Request | AuthenticatedRequest) => {

          try {

            const {walletBot} = await findOrCreateWalletBot((req as AuthenticatedRequest).account)

            const accessToken = await getAccessToken(walletBot)

            const counts = await getPaymentCounts(walletBot)

            const socket = getSocket(walletBot)

            const balances = await listLatestBalances(walletBot)

            const status = socket ? 'connected' : 'disconnected'

            const wallet_bot = {

              id: walletBot.id,

              status

            }

            const access_token = accessToken.uid

            return {

              wallet_bot,

              access_token,

              balances,

              counts

            }
           
          } catch(error: any) {

            log.error('apps.wallet-bot.api', error)

            return badImplementation(error)

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

      wsServer.listen(config.get('WALLET_BOT_WEBSOCKET_PORT'), () => {
        console.log(`WalletBot Websockets server listening on port ${config.get('WALLET_BOT_WEBSOCKET_PORT')}.`);
      });

    }
    

  }

})()

import { requireDirectory } from 'rabbi'
import Joi = require('joi');
import AuthenticatedRequest from '@/server/auth/AuthenticatedRequest';
import { badImplementation } from '@hapi/boom';

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
