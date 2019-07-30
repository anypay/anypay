require('dotenv').config();

import { Actor } from 'bunnies';
import { models } from '../../lib';

import { rpc } from '../../plugins/bch/lib/jsonrpc';

export async function start() {

  Actor
    .create({

      exchange: 'anypay.events',

      routingkey: 'invoice.created',

      queue: 'invoice.create.bch.importaddress.rpc.all'

    })
    .start(async (channel, msg) => {

      let invoice = await parseInvoiceFromMessage(msg);

      console.log(invoice);

      if (invoice.currency !== 'BCH') {
        
        channel.ack(msg);

        return;

      }

      try {


        let params = [

          invoice.address, invoice.uid, false

        ]

        console.log('rpccall', {
          method: 'importaddress',
          params
        })

        let resp = await rpc.callAll('importaddress', params);

        console.log('rpcresp', resp);

      } catch(error) {

        console.error(error.message);

      }

      await channel.ack(msg);

    });
}

async function parseInvoiceFromMessage(msg) {

  var invoice;

  try {

    invoice = JSON.parse(msg.content.toString());

  } catch(error) {

    invoice = await models.Invoice.findOne({ where: {

      uid: msg.content.toString()

    }});

    if (invoice) { invoice = invoice.toJSON() };

  };

  return invoice;

}

if (require.main === module) {

  start();

}

