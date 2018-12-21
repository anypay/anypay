#!/usr/bin/env ts-node

require('dotenv').config();

const yargs = require('yargs');

import { log } from '../logger';

const argv = yargs
  .option('api', {
    default: false
  })
  .option('actors', {
    default: false,
    alias: 'a'
  })
  .option('payments', {
    default: false
  })
  .option('websockets', {
    default: false
  })
  .option('blockcypher', {
    default: false
  })
  .argv

import * as asciiart from 'ascii-art';

//asciiart.style('ANYPAY', { color: 'red' });

(async function () {

  await renderAsciiart();

  if (!argv.api) {

    log.info("API disabled");

  } else {

    require('../servers/rest_api/server').start();

  }

  if (!argv.actors) {

    log.info("Actors disabled");

  } else {

    require('../actors').start(argv.actors);

  }

  if (argv.payments) {

    log.info('start payment processor');

    require('../servers/processor/payments/main.ts');

  } else {

    log.info('payment processor disabled');

  }

  if (argv.websockets) {

    log.info('start websocket server');

    require('../servers/websocket/server.ts');

  } else {

    log.info('websocket server disabled');

  }

  if (argv.blockcypher) {

    log.info('start blockcypher webhook server');

    require('../servers/blockcypher/server.ts');

  } else {

    log.info('blockcypher webhook server disabled');

  }

})();



function renderAsciiart() {

  return new Promise((resolve) => {

    asciiart.font('ANYPAY', 'Doom', function(rendered){
      console.log(rendered);
        //do stuff here
      resolve();
    });

  });

}

