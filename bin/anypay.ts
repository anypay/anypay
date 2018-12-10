#!/usr/bin/env ts-node

const yargs = require('yargs');

import * as lib from '../lib';

const argv = yargs
  .option('api', {
    default: false
  })
  .option('actors', {
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

    require('../actors').start();

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

