
require('dotenv').config();
import { Op } from 'sequelize';

import  { amqp, models } from '../lib';

import { rpc } from '../plugins/bsv/lib/jsonrpc';

import { filter } from 'lodash';

interface Payment {
  currency: string;
  amount: number;
  hash: string;
  address: string;
}

(async () => {

  let channel = await amqp.awaitChannel();

  let invoices = await models.Invoice.findAll({ where: {

    createdAt: {
      [Op.gte]: "10-08-2019"
    },

    status: 'unpaid',

    currency: 'BSV',

    account_id: {
      [Op.not]: 2369 
    }

  }});

  var receivedbyaddress = await rpc.call('listreceivedbyaddress', [0]);

  for (let i=0; i < invoices.length; i++) {

    let invoice = invoices[i].toJSON();

    let currency = 'BSV'; 

    let payments = await getPaymentsToAddress(receivedbyaddress,invoice.address, currency);

    if (payments.length > 0) {
      
      console.log({ invoice, payments });

      payments.forEach(payment => {

        channel.publish('anypay.payments', 'payment',
        Buffer.from(JSON.stringify(payment)));

      });

    }

  }

  console.log(`found ${invoices.length} invoices`);

})();

async function getPaymentsToAddress(receivedbyaddress: any, address: string,
currency: string): Promise<Payment[]> {

  let payments = filter(receivedbyaddress.result, item => {

    return item.address === address;

  });

  console.log('PAYMENTS', payments);

  return payments.map(p => {

    return {
      currency: 'BSV',
      address: p.address,
      amount: p.amount,
      hash: p.txids[0]
    }

  });
  
}

