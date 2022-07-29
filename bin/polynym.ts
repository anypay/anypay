#!/usr/bin/env ts-node

import * as polynym from 'polynym';

import * as program from 'commander';

program
  .command('resolve <address>')
  .action(async (address) => {

    polynym.resolveAddress(address).then(x => {
        console.log(x);
    }).catch(e=>{
        console.error(e);
    });
  
  });
  
program
  .parse(process.argv);

