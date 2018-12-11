
require('dotenv').config();

var zmq = require('zeromq');
var sock = zmq.socket('sub');

import { log, models } from '../../lib';
import { emitter } from '../../lib/events';
import { DashInstantsendTransaction } from '../../lib/models';
import { getTransaction } from '../../plugins/dash/lib/jsonrpc';
import { receivePayment } from '../../lib/payment_processor';

async function start() {

  sock.connect(process.env.DASH_ZEROMQ_URL)
  sock.subscribe('hashtxlock');
  log.info(`zero worker connected to DASH`);

  sock.on('message', async function(topic, msg){

    switch(topic.toString()) {

      case 'hashtxlock':

        let hash = msg.toString('hex');

        log.info(`${topic.toString()} | ${msg.toString('hex')}`);

        let record = await DashInstantsendTransaction.create({ hash });

        log.info(record.toJSON());

        emitter.emit("dash.instantsend.hashlock", hash);

        break;
      }
  });

}

emitter.on("dash.instantsend.hashlock", async (hash) => {

  let tx = await getTransaction(hash);

  log.info(tx);

  let payments = transactionToPayments(tx);

  payments.forEach(async (payment) => {

    let { id } = await receivePayment(payment);

    let invoice = await models.Invoice.findOne({ where: { id }});
    
    if (invoice) {
      log.info(`invoice found for payment ${payment.hash}`);

      console.log("INVOICE PAID WITH INSTANTSEND");

      invoice.complete = true;
      invoice.completed_at = new Date();
      invoice.instantsend = true;

      await invoice.save();

      emitter.emit('invoice.complete', invoice.uid);

    } else {

      log.info(`no invoice found for payment ${payment.hash}`);

    }

  });

});

function transactionToPayments(tx) {

  var hash = tx.txid;

  return tx.vout.map(vout => {

    return {
      hash,
      amount: vout.value,
      address: vout.scriptPubKey.addresses[0],
      currency: 'DASH'
    }

  });

}

if (require.main === module) {

  start();

}

export {
  start
}
