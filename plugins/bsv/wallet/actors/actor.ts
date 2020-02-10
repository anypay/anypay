require('dotenv').config();

const BigNumber: any = require('bignumber.js');

import { Actor, getConnection } from 'rabbi';

import { sendtoaddress } from '../../wallet';

import * as uuid from 'uuid';

import * as datapay from 'datapay';

const privateKey = process.env.BSV_HOT_WALLET_PRIVATE_KEY;

export async function start() {

  let connection = await getConnection();  

  let channel = await connection.createChannel();

  await channel.assertExchange('anypay.vending', 'direct');

  Actor.create({

    exchange: 'anypay.vending',

    routingkey: 'bsv.sendtoaddress',

    queue: 'anypay.vending.bsv.sendtoaddress',

    queueOptions: {

      autoDelete: true

    }

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

  Actor.create({

    exchange: 'anypay.vending',

    routingkey: 'bsv.sendtomany',

    queue: 'anypay.vending.bsv.sendtomany',

    queueOptions: {

      autoDelete: true

    }

  })
  .start(async (channel, msg, json) => {

    console.log('anypay.vending.bsv.sendtomany', json);

    let options = json.outputs.map((output)=>{
      return {
        address: output[0],
        value: (new BigNumber(output[1])).times(100000000).toNumber()
      }
    });

    console.log(options)

    datapay.send({
      safe: true,
      data: json.msg,
      pay: {
        to: options,
        key: privateKey
      }

    }, async (err, res) => {

      if (err) {

        console.error(`bsv.sendtomany.error.${err.message}`);

        console.log(err.message);

        if (json.uid) {

          let queue = `bsv.sendtomany.error.${json.uid}`;

          await channel.sendToQueue(queue, Buffer.from('error sending bsv'));

        }

        await channel.ack(msg);

      } else {

        console.log(`bsv.sent`, res);

        if (json.uid) {

          let queue = `bsv.sendtomany.response.${json.uid}`;

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

