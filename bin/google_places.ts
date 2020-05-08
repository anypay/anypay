#!/usr/bin/env ts-node

import * as program from 'commander';

require('dotenv').config();

import { getPlaceDetails } from '../lib/google_places';

program
  .command('getplacedetails <place_id>')
  .action(async (place_id) => {

    let resp = await getPlaceDetails(place_id);

    console.log(resp);

  });

program.parse(process.argv);
