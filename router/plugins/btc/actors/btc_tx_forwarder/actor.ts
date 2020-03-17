/* implements rabbi actor protocol */

require('dotenv').config();

import { ForwarderFactory } from '../../lib/forwarder_factory';

import { Actor, Joi, log } from 'rabbi';

export async function start() {

  Actor.create({

    exchange: 'anypay.router',

    routingkey: 'transaction.btc',

    queue: 'btc_tx_forwarder',

    schema: Joi.object().keys({
      hex: Joi.string().required()
    })

  })
  .start(async (channel, msg, json) => {

    log.info(json);

    let forwarderFactory = new ForwarderFactory({

      rpc: {

        host: process.env.BTC_RPC_HOST,

        port: process.env.BTC_RPC_PORT,

        password: process.env.BTC_RPC_PASSWORD,

        user: process.env.BTC_RPC_USER

      },

      xprivkey: process.env.BTC_HD_PRIVATE_KEY,

      btcOracleToken: process.env.BTC_ORACLE_ACCESS_TOKEN,

      amqpChannel: channel
      
    });

    let forwarder = forwarderFactory.newForwarder({ hex: json.hex });

    console.log(forwarder)

    await forwarder.getAddressRoute();

    console.log("address route found")

    await forwarder.derivePrivateKey();

    console.log("privkey derived")

    await forwarder.buildOutput();

    console.log("output build")

    await forwarder.signOutput();

    console.log("output signed")

    await forwarder.broadcastOutput();

    console.log("output broadcasted")

    await forwarder.publishForwarded();

    console.log("published forwarded");

    channel.ack(msg);

  });

}

if (require.main === module) {

  start();

}

