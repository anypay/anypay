require('dotenv').config();

import { EventEmitter2 } from 'eventemitter2';
import {connect} from 'amqplib';
import {log} from './logger';
import {models} from './models';

import {publishEventToSlack} from './slack/events';

let emitter = new EventEmitter2({

  wildcard: true

});

const exchange = 'anypay.events';

let events = [

  'account.created',

  'invoice.created',

  'invoice.requested',

  'invoice.payment',

  'invoice.complete'

];

(async function(){ 

  let amqp = await connect(process.env.AMQP_URL);

  let channel = await amqp.createChannel();

  log.debug('amqp channel created');

  await channel.assertExchange(exchange, 'direct');

  // publish event when emitted

  events.forEach(event => {

    emitter.on(event, async (data) => {

      var message;

      if (typeof data === 'string') {

        message = data;

      } else {

        message = JSON.stringify(data);

      }

      await channel.publish(exchange, event, new Buffer(message));

      log.info(`amqp.published`, { exchange, event, message })

    });

  });

  emitter.on('*', async function (data) {

    log.info(`event emitted: ${this.event}`);

    let message = JSON.stringify(data);

    await channel.publish(exchange, this.event, new Buffer(message));

    log.info(`published to amqp ${exchange}.${this.event}`, message)

  });

  log.debug('bound all events to amqp');

  emitter.on('*', async function (data) {

    try {

      let resp = await publishEventToSlack(`${this.event} ${JSON.stringify(data)}`)

      log.info(`published to slack ${this.event}`, data)

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

export { emitter }

