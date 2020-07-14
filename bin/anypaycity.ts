#!/usr/bin/env ts-node

import * as program from 'commander';

import { models } from '../lib';
import { addToCity } from '../lib/anypaycity';

program
  .command('add <email> <city> [stub]')
  .action(async (email, city, stub) => {

    await addToCity(email, city, stub);

    process.exit(0); 

  });

program
  .parse(process.argv);

