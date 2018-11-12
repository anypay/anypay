const Invoice = require("../../../lib/models/invoice");
const log = require('winston');
const Boom = require('boom');
const uuid = require('uuid')

import {emitter} from '../../../lib/events';
import {plugins} from '../../../lib/plugins';
import {emitter} from '../../../lib/events';
import { statsd } from '../../../lib/stats/statsd';

module.exports.index = async (request, reply) => {

  log.info(`controller:invoices,action:index`);

  var invoices = await Invoice.findAll({
    where: {
      account_id: request.auth.credentials.accessToken.account_id
    }
  });

  return { invoices };
};

module.exports.create = async (request, reply) => {

  /*

    Dynamicallly look up coin and corresponding plugin given the currency
    provided.

  */

  log.info(`controller:invoices,action:create`);

	if (!request.payload.currency) {
		throw Boom.badRequest('no currency paramenter provided')
	}

	log.info('currency parameter provided')

	if (!(request.payload.amount > 0)) {
		throw Boom.badRequest('amount must be greater than zero')	
	}

	log.info('amount is greater than zero')

  try {

    let plugin = await plugins.findForCurrency(request.payload.currency);

    let invoice = await plugin.createInvoice(request.account.id, request.payload.amount);

    if(invoice){
   
      log.info('invoice.created', invoice.toJSON());

      emitter.emit('invoice.created', invoice.toJSON());

    }

    return invoice;

  } catch(error) {

    throw Boom.badRequest(error.message);

    log.error(error.message);

  }

};

module.exports.show = async function(request, reply) {

  let invoiceId = request.params.invoice_id;

  log.info(`controller:invoices,action:show,invoice_id:${invoiceId}`);

  let invoice = await Invoice.findOne({
    where: {
      uid: invoiceId
    }
  });

  if (invoice) {

    log.info('invoice.requested', invoice.toJSON());

    emitter.emit('invoice.requested', invoice.toJSON()); 

    return invoice;

  } else {

    log.error('no invoice found', invoiceId);

    throw new Error('invoice not found')
  }

}

emitter.on('invoice.requested', async (invoice) => {

  statsd.increment('invoice requested')

  poll(invoice)

})
emitter.on('invoice.created', async (invoice) => {
  
  log.info("invoice.created")
 
  poll(invoice)
  
})

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function poll(invoice){

  invoice = await Invoice.findOne({ where: {uid: invoice.uid}})

  if(invoice.status == 'paid'){break}

  let plugin = await plugins.findForCurrency(invoice.currency);

  await plugin.checkAddressForPayments(invoice.address,invoice.currency)

  if(plugin.poll == false){return}

  let waitTime = []

  for(let j = 0; j<120;j++){
    if( j<60 ){
      waitTime.push(2000)
    }
    else{
      waitTime.push(4000)
    }
  }

  for(let i=0;i<waitTime.length;i++){

    invoice = await Invoice.findOne({ where: {uid: invoice.uid}})

    if(invoice.status == 'paid'){break}

    log.info("Polling invoice:", invoice.uid, invoice.currency, invoice.amount, invoice.address)

    await plugin.checkAddressForPayments(invoice.address,invoice.currency)

    await sleep(waitTime[i]);

  }

}
