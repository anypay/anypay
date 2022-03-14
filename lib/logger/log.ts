
const Pino = require('pino')

import { logInfo, logError } from './'

import { models } from '../models'

import { publish } from '../amqp'

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

class Logger {

  namespace: string;

  pino: typeof Pino;

  constructor(params: NewLogger = {namespace: ''}) {

    this.pino = Pino()

    this.namespace = params.namespace

  }

  async info(type: string, payload: any = {}) {

    logInfo(type, payload)

    await publish(type, payload, 'anypay.topic')

    return models.Event.create({
      namespace: this.namespace,
      event: type,
      payload
    })

  }

  async error(error_type: string, payload: any = {}) {

    this.pino.error({...payload, namespace: this.namespace }, error_type)

    let record = await models.Event.create({
      namespace: this.namespace,
      event: error_type,
      payload,
      error: true
    })

    return record;

  }

  async debug(...params) {

    this.pino.debug(params)

  }

  async read(query: LogQuery = {}) {

    this.pino.debug('log.read', query)

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

