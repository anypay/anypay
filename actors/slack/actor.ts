import { plugins, log, models } from '../../lib';
import { emitter } from '../../lib/events';
import * as SlackNotifier from "../../lib/slack/notifier";

async function start() {

  log.info("start slack actor");

	emitter.on('invoice.created', async (invoice) => {

		models.Account.findOne({ where: { id: invoice.account_id } })
		  .then(account => {

		    const message = `|${account.email}|${invoice.denomination_amount} ${invoice.denomination_currency}|${invoice.amount} ${invoice.currency}|https://pos.anypayinc.com/invoices/${invoice.uid}`;

	            SlackNotifier.notify(`invoice:created ${message}`);
		  })
		  .catch(error => {
		    log.error(error.message);
		  });
	  
	})


}

export {
	start
}

if (require.main === module) {

  start();

}

