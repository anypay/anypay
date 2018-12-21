#!/usr/bin/env ts-node

require('dotenv').config();

const yargs = require('yargs');

import * as lib from '../lib';

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

    lib.log.info("API disabled");

  } else {

    require('../servers/rest_api/server').start();

  }

  if (!argv.actors) {

    lib.log.info("Actors disabled");

  } else {

    require('../actors').start(argv.actors);

  }

  if (argv.payments) {

    lib.log.info('start payment processor');

    require('../servers/processor/payments/main.ts');

  } else {

    lib.log.info('payment processor disabled');

  }

  if (argv.websockets) {

    lib.log.info('start websocket server');

    require('../servers/websocket/server.ts');

  } else {

    lib.log.info('websocket server disabled');

  }

  if (argv.blockcypher) {

    lib.log.info('start blockcypher webhook server');

    require('../servers/blockcypher/server.ts');

  } else {

    lib.log.info('blockcypher webhook server disabled');

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

