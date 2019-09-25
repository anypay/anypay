#!/usr/bin/env ts-node

import * as program from 'commander';

import { generateCode } from '../lib/dash/dashtext';

program
  .command('generatecode')
  .action(async () => {

    try {

      let code = await generateCode('XsceVTMC4oYmGyJbx8fitopPGHxakK6JGe', 1000) ;

      console.log(code);

    } catch(error) {

      console.log(error)

    }


    process.exit(0);

  });


program.parse(process.argv);
