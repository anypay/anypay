require('dotenv').config();

import {connect} from 'amqplib';

import {log} from './log';

import {models} from './models';

import { Orm } from './orm'

import { Invoice } from './invoices'

import { Account } from './account'

import { events } from 'rabbi'

import {publishEventToSlack} from './slack/events';

const exchange = 'anypay.events';

(async function(){ 

  let amqp = await connect(process.env.AMQP_URL);

  let channel = await amqp.createChannel();

  log.debug('amqp.channel.created');

  await channel.assertExchange(exchange, 'direct');

  // publish event when emitted

  events.on('*', async function (data) {

    log.info('event.emitted', this.event);

    let message = JSON.stringify(data);

    await channel.publish(exchange, this.event, Buffer.from(message));

    log.info(`amqp.published`, { exchange, event: this.event, message })

  });

  log.debug('bound all events to amqp');

  events.on('*', async function (data) {

    try {

      let resp = await publishEventToSlack(`${this.event} ${JSON.stringify(data)}`)

    } catch (error) {

      log.error('slack.publish.error', error);
    }

  });

  log.debug('bound to all events to slack');

})()

interface EventData {
  event: string;
  payload: any;
  account_id?: number;
}

export async function record(data: EventData) {

  return models.Event.create(data);

}

export async function recordEvent(payload: any, event: string): Promise<Event> {

  let record = await models.Event.create({ payload, event });

  return new Event(record)

}

export class Event extends Orm {

  get(key) {

    let value = this.record.dataValues[key]

    if (value) return value

    return this.record.dataValues.payload[key]

  }

  toJSON() {

    let json = this.record.toJSON()

    json.type = json.event

    delete json['event']

    return json

  }

}

export async function listEvents(event: string, payload: any): Promise<Event[]> {

  let records = await models.Event.findAll({

    where: {

      event,

      payload

    }

  })

  return records.map(record => new Event(record))

}

export async function listInvoiceEvents(invoice: Invoice, type?: string): Promise<Event[]> {

  var where = {

    payload: { invoice_uid: invoice.uid },

  }

  if (type) {

    where['event'] = type

  }

  let records = await models.Event.findAll({ where })

  return records.map(record => new Event(record))

}

interface EventLogOptions {
  type?: string;
  order?: string;
}

export async function listAccountEvents(account: Account, options: EventLogOptions={}): Promise<Event[]> {

  var query = {

    where: {

      account_id: account.id

    },

    order: [['createdAt', 'desc']]

  }

  if (options.type) {

    query.where['event'] = options.type

  }

  if (options.order) {

    query.order = [['createdAt', options.order]]

  }

  let records = await models.Event.findAll(query)

  return records.map(record => new Event(record))

}

export { events as emitter }

export { events }

