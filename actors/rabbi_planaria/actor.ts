/* implements rabbi actor protocol */

require('dotenv').config();

const { planaria } = require("./neonplanaria")
const MongoClient = require('mongodb')
const EventSource = require('eventsource')

import { Actor, Joi, log, getChannel } from 'rabbi'; 


export async function start() {

  // Base64 encode your bitquery
  const b64 = Buffer.from(JSON.stringify({
    "v": 3, "q": { "find": {
      "out.s2": "1NRKGVUJGJER9MFUdPcHqdXAJvmrwwCoiT" 
    } }
  })).toString("base64")

  // Subscribe
  const sock = new EventSource('https://txo.bitsocket.network/s/'+b64)
  sock.onmessage = async function(e) {
    console.log(e);

    let channel = await getChannel();

    let message = JSON.parse(e.data);

    console.log(message);

    if (message.data && message.data[0] && message.data[0].out) {

      let output = message.data[0].out[0]

      let amqpEvent = {
        txid: message.data[0].tx.h,
        exchange: output.s3,
        routingkey: output.s4,
        message: output.s5
      };

      console.log(amqpEvent);

      try {
        await channel.assertExchange(amqpEvent.exchange, 'topic');

        await channel.publish(amqpEvent.exchange, amqpEvent.routingkey, Buffer.from(
          JSON.stringify(amqpEvent) 
        ));
        
      } catch(error) {
        console.log(error.message);
      }
    }
  }

  require('../rabbi_planaria_log_events/actor').start();

}

if (require.main === module) {

  start();

}

