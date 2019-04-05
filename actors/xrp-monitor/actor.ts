import { log, models } from '../../lib';

import { connect } from 'amqplib';

import { rippleLib_checkAddressForPayments } from '../../plugins/xrp/lib/ripple_restAPI';

import { Op } from 'sequelize';

import * as moment from 'moment';

require('dotenv').config();

async function start() {

  let connection = await connect(process.env.AMQP_URL);

  var channel = await connection.createChannel();

  log.info('amqp.channel.created');

  await channel.assertExchange('anypay.xrp', 'direct');

  await channel.assertQueue('anypay.xrp.invoice.monitor');

  await channel.bindQueue(
    'anypay.xrp.invoice.monitor',
    'anypay.events',
    'invoice.created'
  );

  log.info('amqp.channel.connected');

  channel.consume('anypay.xrp.invoice.monitor', async (msg) => {

    try {

      let invoiceUID = msg.content.toString();

      log.info('anypay.xrp.payment.monitor', invoiceUID);

      let invoice = await models.Invoice.findOne({ where: { uid: invoiceUID }});

      if (!invoice) {

        return channel.ack(msg);

      }

      if (invoice.currency !== 'XRP') {

        return channel.ack(msg);

      }

      pollForInvoice(invoice, channel);

    } catch(error) {

      log.error(error.message);
    }

    channel.ack(msg);

  });

  
  let recent = await getRecentInvoices();

}

class InvoicePoller {

  invoice: any;

  interval: any;

  channel: any;

  constructor(invoice, channel) {

    this.invoice = invoice;
    this.channel = channel;
  }

  async updateInvoice() {

    this.invoice = await models.Invoice.findOne({ where: { id: this.invoice.id }});

  }

  stopPolling() {

    clearInterval(this.interval);

    log.info("stop polling for invoice", this.invoice.uid);
  }

  pollForPayment() {

    log.info('polling for invoice', this.invoice.uid);

    this.interval = setInterval(async () => {

      await this.updateInvoice();

      let expires = moment(this.invoice.expiry);

      let now = moment(); 

      if (expires.valueOf() < now.valueOf()) {

        this.stopPolling();

        return;

      }

      if (this.invoice.status === 'unpaid') {

        try {

          let [account, tag] = this.invoice.address.split('?dt=');

          log.info(`check for payments acct:${account} - tag:${tag}`);

          var payment = await rippleLib_checkAddressForPayments(account, tag);

          if (payment) {

            log.info('payment found', payment);

            let message = new Buffer(JSON.stringify(payment));

            this.channel.publish('anypay.payments', 'payment', message);
    
          } else {

            log.info(`no payment found acct:${account} - tag:${tag}`);

          }

        } catch(error) {

          log.error(error.message);

        }

      } else {

        clearInterval(this.interval);

      }

    }, 10000);

  }

}

function pollForInvoice(invoice, channel) {

  let poller = new InvoicePoller(invoice, channel);

  poller.pollForPayment();

}

async function getRecentInvoices() {

  let now = moment();

  let cutoff = now.subtract(15, 'minutes');


  let invoices = await models.Invoice.findAll({ where: {

    currency: 'XRP',

    status: 'unpaid',

    createdAt: {

      [Op.gte]: cutoff.toDate()

    }

  }});


}

export {
	start
}

if (require.main === module) {

  start();

}
