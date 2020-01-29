#!/usr/bin/env ts-node

import * as program from 'commander';
import * as http from 'superagent';

program
  .command('getqueues')
  .action(async () => {

    let username = 'rabbitmq';

    let resp = await http
      .get('http://199.193.6.122:15672/api/queues')
      .auth(username, process.env.AMQP_PASSWORD)

    console.log(resp.body);

  })

program
  .command('getchannels')
  .action(async () => {

    let username = 'rabbitmq';

    let resp = await http
      .get('http://199.193.6.122:15672/api/channels')
      .auth(username, process.env.AMQP_PASSWORD)

    console.log(resp.body);

  })

program
  .command('getexchanges')
  .action(async () => {

    let username = 'rabbitmq';

    let resp = await http
      .get('http://199.193.6.122:15672/api/exchanges')
      .auth(username, process.env.AMQP_PASSWORD)

    console.log(resp.body);

  })

program
  .command('getbindings')
  .action(async () => {

    let username = 'rabbitmq';

    let resp = await http
      .get('http://199.193.6.122:15672/api/bindings')
      .auth(username, process.env.AMQP_PASSWORD)

    console.log(resp.body);

  })

program
  .parse(process.argv);

