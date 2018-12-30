import { plugins, log, models } from '../../lib';
import { emitter } from '../../lib/events';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function poll(invoice){
  log.info(`poll.begin.${invoice.uid}`);

  let plugin = await plugins.findForCurrency(invoice.currency);

  if(plugin.poll === false){

    log.debug(`polling disabled for ${invoice.currency} ${invoice.address}`);

    return; 
  }

  let waitTime = [5000,2000,2000,4000,4000,8000,8000.8000,16000,16000,16000,16000]

  for(let i=0;i<waitTime.length;i++){

    try {

      log.info("polling.invoice:", invoice.uid, invoice.currency, invoice.amount, invoice.address)

      invoice = await models.Invoice.findOne({ where: {uid: invoice.uid}});

      if(invoice.status === 'paid'){ break }

      await plugins.checkAddressForPayments(invoice.address,invoice.currency);

    } catch(error) {

      log.error(error.message);

    }

    log.debug(`sleep ${waitTime[i]}`);

    await sleep(waitTime[i]);

  }

}

async function start() {

  log.info("START POLLER ACTOR");

	emitter.on('invoice.created', async (invoice) => {
	  
		log.info(`invoice.created ${invoice.uid}`);
		log.info(`invoice.startpolling ${invoice.uid}`);

		emitter.emit('invoice.poll', invoice);
	 
	  poll(invoice)
	  
	})


}

export {
	start
}

if (require.main === module) {

  start();

}

