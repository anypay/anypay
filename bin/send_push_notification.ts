#!/usr/bin/env ts-node

require('dotenv').config();

import * as program from 'commander';

import { sendMessage } from '../lib/push_notifications';

program
  .command('sendmessage <email> <title> <body>') 
  .action(async (email, title, body) => {

    try {

      let resp = await sendMessage(email, title, body);

      console.log(resp);

    } catch(error) {

      console.log(error);

    }

    process.exit(0);

  });

program
  .parse(process.argv);
