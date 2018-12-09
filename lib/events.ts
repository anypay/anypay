require('dotenv').config();

import {EventEmitter} from 'events';
import {connect} from 'amqplib';
import {log} from './logger';

let emitter = new EventEmitter();

const exchange = 'anypay.events';

let events = [

  'invoice.created',

  'invoice.requested',

  'dash.instantsend.hashlock'

];

(async function(){ 

  let amqp = await connect(process.env.AMQP_URL);

  let channel = await amqp.createChannel();

  log.info('amqp channel created');

  await channel.assertExchange(exchange, 'direct');

  // publish event when emitted

  events.forEach(event => {

    emitter.on(event, async (data) => {

      let message = JSON.stringify(data);

      await channel.publish(exchange, event, new Buffer(message));

      log.info(`published to amqp ${exchange}.${event}`, message)

    });

  });


})()

export { emitter }

