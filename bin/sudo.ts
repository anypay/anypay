#!/usr/bin/env ts-node

require('dotenv').config();

import * as program from "commander";

import { v4 } from 'uuid';

import { hash } from '../lib/password';

import { log } from '../lib';

program

  .command('generatepassword')

  .action(async () => {

    let password = v4();


    let password_hash = await hash(password);

    log.info({

      password,

      password_hash

    })

    process.exit(0);

  })

program

  .command('hashpassword <password>')

  .action(async (password) => {

    let password_hash = await hash(password);

    log.info({

      password,

      password_hash

    })

    process.exit(0);

  })

program.parse(process.argv);

