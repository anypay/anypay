#!/usr/bin/env ts-node

import * as program from 'commander';

import { listCities } from '../lib';
import { models } from '../../lib';

program
  .command('addcity <name> <stub>')
  .action(async (name, stub) => {

    try {

      let city = await models.City.create({
        name,
        stub,
        tag: `city:${stub}`
      });

      console.log(city.toJSON());

      process.exit(0);
    } catch(error) {
      console.log(error);
    }

  });

program
  .command('listcities')
  .action(async () => {

    try {

      let result = await listCities();

      console.log(result);

    } catch(error) {
      console.log(error.message);
    }

    process.exit(0);
  
  });

program.parse(process.argv);

