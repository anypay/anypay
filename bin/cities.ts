#!/usr/bin/env ts-node

require('dotenv').config();

import * as program from 'commander';

import { getNHCitiesPopulationCSV, importCities } from '../lib/cities';
import { log } from '../lib';

program
  .command('getcities')
  .action(async () => {

    let cities = await getNHCitiesPopulationCSV();

    console.log(cities);

  });

program
  .command('importcities')
  .action(async () => {

    let cities = await getNHCitiesPopulationCSV();

    await importCities(cities);

    console.log(cities);

  });

program
  .parse(process.argv);

