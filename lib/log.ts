
const riverpig = require('riverpig')

import { models } from './models'

import { publish } from './amqp'

import { config } from './config'

const lokiEnabled = config.get('loki_enabled')

interface NewLogger {
  namespace: string;
}

interface LogQuery {
  type?: string;
  payload?: any;
  limit?: number;
  offset?: number;
  order?: 'asc' | 'desc';
  error?: boolean;
}

import * as winston from 'winston';

const transports = []

if (config.get('loki_enabled') && config.get('loki_host')) {

  console.log('loki enabled')

  const LokiTransport = require("winston-loki");

  const lokiConfig = {
    format: winston.format.json(),
    host: config.get('loki_host'),
    json: true,
    batching: false,
    labels: { app: config.get('loki_label_app') }
  }

  if (config.get('loki_basic_auth')) {

    lokiConfig['basicAuth'] = config.get('loki_basic_auth')
  }

  transports.push(
    new LokiTransport(lokiConfig)
  )

}

const loki = winston.createLogger({
  level: 'info',
  transports,
  format: winston.format.json()
});

class Logger {

  namespace: string;

  log: any;

  constructor(params: NewLogger = {namespace: ''}) {

    this.log = riverpig('anypay')

    this.namespace = params.namespace

  }

  async info(type: string, payload: any = {}) {
    
    if (typeof payload.toJSON === 'function') {

      payload = payload.toJSON()

    }

    if (config.get('NODE_ENV') !== 'test') {

      this.log.info(type, payload)

      if (lokiEnabled) {
        loki.info(type, payload)
      }
      
      await publish(type, payload, 'anypay.topic')

      if (payload.account_id) {

        const routing_key = `accounts.${payload.account_id}.events`

        await publish(routing_key, { payload, type }, 'anypay.topic')
      }

      if (payload.invoice_uid) {

        const routing_key = `invoices.${payload.invoice_uid}.events`

        await publish(routing_key, { payload, type }, 'anypay.events')

      }

    }

    return models.Event.create({
      namespace: this.namespace,
      type,
      payload,
      account_id: payload.account_id,
      invoice_uid: payload.invoice_uid
    })

  }

  async error(error_type: string, error: Error) {

    this.log.error(error_type, error.message)

    loki.error(error_type, error.message)

    let record = await models.Event.create({
      namespace: this.namespace,
      type: error_type,
      payload: { error: error.message },
      error: true
    })

    return record;

  }

  async debug(type: string, payload:any={}) {

    this.log.debug(type, payload)

    if (lokiEnabled) {
      loki.debug(type, payload)
    }

  }

  async read(query: LogQuery = {}) {

    this.log.debug('log.read', query)

    const where = {
      namespace: this.namespace,
      error: query.error || false
    }

    if (query.type) { where['type'] = query.type }

    if (query.payload) { where['payload'] = query.payload }

    const findAll = {

      where,

      limit: query.limit || 100,

      offset: query.offset || 0,

      order: [['createdAt', query.order || 'asc']]

    }

    let records = await models.Event.findAll(findAll)

    return records;

  }

}

const log = new Logger({ namespace: 'anypay' })

export { log }

if (config.get('loki_host')) {

  log.info('loki.enabled')

}



