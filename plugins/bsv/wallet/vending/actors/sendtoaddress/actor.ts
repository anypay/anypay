require('dotenv').config();

const BigNumber: any = require('bignumber.js');

import { Actor, getConnection } from 'rabbi';

import { sendtoaddress } from '../../lib/wallet';

import * as uuid from 'uuid';

import * as datapay from 'datapay';

const privateKey = process.env.VENDING_HOT_WALLET_BSV;

export async function start() {

  let connection = await getConnection();  

  let channel = await connection.createChannel();

  await channel.assertExchange('anypay.vending', 'direct');

  Actor.create({

    exchange: 'anypay.vending',

    routingkey: 'bsv.sendtoaddress',

    queue: 'anypay.vending.bsv.sendtoaddress'

  })
  .start(async (channel, msg, json) => {

    console.log('anypay.vending.bsv.sendtoaddress', msg.content.toString());

    let amount = (new BigNumber(json.amount)).times(100000000);

    datapay.send({
      safe: true,
      pay: {
        to: [{
          address: json.address,
          value: amount.toNumber() // convert BSV to satoshis
        }],
        key: privateKey
      }

    }, async (err, res) => {

      if (err) {

        console.error(`bsv.sendtoaddress.error.${err.message}`);

        console.log(err.message);

        if (json.uid) {

          let queue = `bsv.sendtoaddress.error.${json.uid}`;

          await channel.sendToQueue(queue, Buffer.from('error sending bsv'));

        }

        await channel.ack(msg);

      } else {

        console.log(`bsv.sent`, res);

        if (json.uid) {

          let queue = `bsv.sendtoaddress.response.${json.uid}`;

          await channel.sendToQueue(queue, Buffer.from(res));

        }

        await channel.ack(msg);

      }

    });
  

  });

}

if (require.main === module) {

  start();

}

