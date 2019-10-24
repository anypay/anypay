require('dotenv').config()

import { models } from '../../../lib';

const log = require('winston');

import * as amqp from 'amqplib';

let connection, chan;

( async ()=>{

  connection = await amqp.connect(process.env.AMQP_URL);
        
  chan = await connection.createChannel();

})()

module.exports.sudoIndex = async (request, reply) => {

  log.info(`controller:prices,action:index`, request.query);

  const prices = await models.Price.findAll();

  return { prices };

};

module.exports.sudoUpdate = async function() {

  chan.publish('anypay.prices', 'fetch.prices', Buffer.from('fetch prices'))

  return true;

}

module.exports.sudoShow = async function(request, reply) {

  let currency = request.params.currency;

  log.info(`controller:pricess,action:show,currency:${currency}`);

  try {

	  let prices = await models.Price.findAll({
	    where: {
	      currency: currency
	    }
	  });

	  if (prices) {

        return prices;

	  } else {

	    log.error('no price found', currency);

        throw new Error(`price for ${currency} not found`)
	  }
  } catch(error) {
	  log.error(error.message);
  }


}
