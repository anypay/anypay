require('dotenv').config();

import {connect} from 'amqplib';
import {log, logInfo} from './logger';
import {models} from './models';

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

export { events as emitter }
export { events }

