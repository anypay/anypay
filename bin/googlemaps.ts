#!/usr/bin/env ts-node

import * as program from 'commander';

require('dotenv').config();

const googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_MAPS_API_KEY,
  Promise: Promise
});

program
  .command('geocode <address>')
  .action(async (address) => {

    let resp = await googleMapsClient.geocode({address}).asPromise();

    console.log(resp.json.results[0].geometry.location);

  });

program.parse(process.argv);
