require('dotenv').config();

import {connect} from 'amqplib';
import {log, logInfo} from './logger';
import {models} from './models';

import { Orm } from './orm'

import { Invoice } from './invoices'

import { events } from 'rabbi'

import {publishEventToSlack} from './slack/events';

const exchange = 'anypay.events';

(async function(){ 

  let amqp = await connect(process.env.AMQP_URL);

  let channel = await amqp.createChannel();

  log.debug('amqp channel created');

  await channel.assertExchange(exchange, 'direct');

  // publish event when emitted

  events.on('*', async function (data) {

    log.info('event.emitted', this.event);

    let message = JSON.stringify(data);

    await channel.publish(exchange, this.event, new Buffer(message));

    logInfo(`amqp.published`, { exchange, event: this.event, message })

  });

  log.debug('bound all events to amqp');

  events.on('*', async function (data) {

    try {

      let resp = await publishEventToSlack(`${this.event} ${JSON.stringify(data)}`)

    } catch (error) {

      console.log('error', error.msg);
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

export async function recordEvent(payload: any, event: string) {

  console.log("RECORD EVENT", { payload, event })

  let record = await models.Event.create({ payload, event });

  return new Event(record)

}

class Event extends Orm {

  get(key) {

    let value = this.record.dataValues[key]

    if (value) return value

    return this.record.dataValues.payload[key]

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

export async function listInvoiceEvents(invoice: Invoice): Promise<Event[]> {

  let records = await models.Event.findAll({

    where: {

      payload: { invoice_uid: invoice.uid }

    }

  })

  return records.map(record => new Event(record))

}

export { events as emitter }

export { events }

