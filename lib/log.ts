
const riverpig = require('riverpig')

import { models } from './models'

import { publish } from './amqp'

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

export class Logger {

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

    this.log.info(type, payload)

    await publish(type, payload, 'anypay.topic')

    if (payload.account_id) {

      const routing_key = `accounts.${payload.account_id}.events`

      await publish(routing_key, { payload, type }, 'anypay.topic')
    }

    return models.Event.create({
      namespace: this.namespace,
      type,
      payload,
      account_id: payload.account_id
    })


  }

  async error(error_type: string, payload: any = {}) {

    this.log.error({...payload, namespace: this.namespace }, error_type)

    let record = await models.Event.create({
      namespace: this.namespace,
      type: error_type,
      payload,
      error: true
    })

    return record;

  }

  async debug(...params) {

    this.log.debug(params)

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

