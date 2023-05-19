
require('dotenv').config()

import config from './config'

import { Server } from '@hapi/hapi'

import { log } from './log'

import { join } from 'path'

const Joi = require('joi')

const Pack = require('../package');

import { load } from './server/handlers'

const handlers = load(join(__dirname, './server/handlers'))

const port = config.get('port')

export const server = new Server({
  host: config.get('host'),
  port: config.get('port') || 5200,
  routes: {
    cors: true,
    validate: {
      options: {
        stripUnknown: true
      }
    }
  }
});

export async function start() {

  await server.register(require('@hapi/basic'));

  server.auth.strategy('prometheus', 'basic', {

    validate: async (req, password) => {

      if (config.get('prometheus_password') == undefined) {

        return { isValid: true, credentials: {id: 'public'} }

      }

      if (password === config.get('prometheus_password')) {

        return { isValid: true, credentials: {id: 'prometheus'} }

      } else {

        return { isValid: false, credentials: null }

      }

    }
  })

  if (config.get('prometheus_enabled')) {

    log.debug('server.metrics.prometheus', { path: '/metrics' })

    const { register: prometheus } = require('./metrics')

    server.route({
      method: 'GET',
      path: '/metrics',
      handler: async (req, h) => {
        return h.response(await prometheus.metrics())
      },
      options: {
        description: 'Prometheus Metrics about Node.js Process & Business-Level Metrics',
        tags: ['system'],
        auth: 'prometheus'
      }
    })

  }

  server.route({
    method: 'GET', path: '/api/v0/status',
    handler: handlers.Status.index,
    options: {
      description: 'Simply check to see that the server is online and responding',
      tags: ['api', 'system'],
      response: {
        failAction: 'log',
        schema: Joi.object({
          status: Joi.string().valid('OK', 'ERROR').required(),
          error: Joi.string().optional()
        }).label('ServerStatus')
      }
    }
  })

  server.route({
    method: 'GET', path: '/api/v1/balances',
    handler: handlers.Balances.index,
    options: {
      description: 'List coin balances available',
      tags: ['api', 'system'],
      response: {
        failAction: 'log',
        schema: Joi.object({
          balances: Joi.array().items(Joi.object({
            currency: Joi.string().required(),
            value: Joi.number().required(),
            usd_value: Joi.number().required(),
            threshold_minimum: Joi.number().optional(),
            address: Joi.string().optional(),
            last_updated: Joi.date()
          }))
          
        }).label('ServerStatus')
      }
    }
  })

  server.route({
    method: 'GET', path: '/api/v1/payments',
    handler: handlers.Payments.index,
    options: {
      description: 'List payments sent by the bot app account',
      tags: ['api', 'system'],
      response: {
        failAction: 'log',
        schema: Joi.object({
          payments: Joi.array().items(Joi.object({

          }))
        }).label('ListPayments')
      }
    }
  })

  var started = false



  if (started) return;

  started = true

  if (config.get('swagger_enabled')) {

    const swaggerOptions = {
      info: {
        title: 'API Docs',
        version: Pack.version,
        description: 'Developer API Documentation \n\n *** DEVELOPERS *** \n\n Edit this file under `swaggerOptions` in `src/server.ts` to better describe your service.'
      },
      schemes: ['http'],
      host: 'localhost:5200',
      documentationPath: '/',
      grouping: 'tags'
    }

    const Inert = require('@hapi/inert');

    const Vision = require('@hapi/vision');

    const HapiSwagger = require('hapi-swagger');

    await server.register([
        Inert,
        Vision,
        {
          plugin: HapiSwagger,
          options: swaggerOptions
        }
    ]);

    log.info('server.api.documentation.swagger', swaggerOptions)
  }

  await server.start();

  log.info(server.info)

  return server;

}

if (require.main === module) {

  start()

}
