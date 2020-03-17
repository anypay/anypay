/* implements rabbi actor protocol */

require('dotenv').config();

import { ForwarderFactory } from '../../lib/forwarder_factory';

import { Actor, Joi, log } from 'rabbi';

export async function start() {

  Actor.create({

    exchange: 'anypay.router',

    routingkey: 'transaction.bch',

    queue: 'bch_tx_forwarder.staging',

    schema: Joi.object().keys({
      hex: Joi.string().required()
    })

  })
  .start(async (channel, msg, json) => {

    log.info(json);

    let forwarderFactory = new ForwarderFactory({

      rpc: {

        host: process.env.BCH_RPC_HOST,

        port: process.env.BCH_RPC_PORT,

        password: process.env.BCH_RPC_PASSWORD,

        user: process.env.BCH_RPC_USER

      },

      xprivkey: process.env.BCH_HD_PRIVATE_KEY,

      bchOracleToken: process.env.BCH_ORACLE_ACCESS_TOKEN,

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

