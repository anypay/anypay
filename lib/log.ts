
const riverpig = require('riverpig')

import { models } from './models'

import { publish } from 'rabbi'

import { config } from './config'

const lokiEnabled = config.get('loki_enabled')

interface NewLogger {
  namespace?: string;
  env?: string; 
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

const transports = [
  new winston.transports.Console({ level: 'debug' })
]

if (config.get('loki_enabled') && config.get('loki_host')) {

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

export class Logger {

  namespace: string;

  log: any;

  env: string;

  constructor(params: NewLogger = {namespace: 'anypay'}) {

    this.log = riverpig('anypay')

    this.namespace = params.namespace || 'anypay'

    this.env = params.env || process.env.NODE_ENV

  }

  async info(type: string, payload: any = {}) {
    
    if (typeof payload.toJSON === 'function') {

      payload = payload.toJSON()

    }

    if (this.env !== 'test') {

      this.log.info(type, payload)

      if (lokiEnabled) {
        loki.info(type, payload)
      }
    }
      


    const record = await models.Event.create({
      namespace: this.namespace,
      type,
      payload,
      account_id: payload.account_id,
      invoice_uid: payload.invoice_uid,
      error: false
    })

    await publish('anypay.events', type, payload)

    if (payload.account_id) {

      const routing_key = `accounts.${payload.account_id}.events`

      await publish('anypay.events', routing_key, record.toJSON())    

    }

    if (payload.app_id) {

      const routing_key = `apps.${payload.app_id}.events`

      await publish('anypay.events', routing_key, record.toJSON())

    }

    if (payload.invoice_uid) {

      const routing_key = `invoices.${payload.invoice_uid}.events`

      await publish( 'anypay.events', routing_key, record.toJSON())

    }

    publish('anypay.events', 'event.created', record.toJSON())

    return record

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

  async read(query: LogQuery = {}): Promise<any[]> {

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
