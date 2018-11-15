import {emitter} from '../lib/events'

const routing_key = 'payment';

const exchange = 'anypay.payments';

import { channel } from '../lib/amqp';

import {log} from '../lib'

emitter.on('payment',(payment)=>{

  log.info('Payment publisher', payment)

  if (!channel) {

  	log.error('amqp channel not yet connected');
	
	  var interval = setInterval(() => {

		if (channel) {

			clearInterval(interval);

			publish(payment);

			log.info("payment.publish", payment)
		}
	  
	  }, 1000);

  } else {

	  publish(payment);
  }


})

function publish(payment) {

  channel.publish(exchange, routing_key, Buffer.from(JSON.stringify(payment)));

}
