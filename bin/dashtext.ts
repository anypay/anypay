#!/usr/bin/env ts-node

import * as program from 'commander';

import { generateCode } from '../lib/dash/dashtext';

program
  .command('generatecode <uid>')
  .action(async (uid) => {

    try {

      let code = await generateCode(uid) ;

      console.log(code);

    } catch(error) {

      console.log(error)

    }


    process.exit(0);

  });


program.parse(process.argv);
