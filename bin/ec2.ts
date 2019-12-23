#!/usr/bin/env ts-node

import * as program from 'commander';

program
  .command('authorizeport <publicIp> <port> <cidr>')
  .action((publicIp, port, cidr) => {

    // 1) look up the ec2 instance id from the public ip
    //
    // 2) look up the security group applied to that instance
    //
    // 3) authorize ingress by cidr for the port in that group
    //

    process.exit(0);

  });

program.parse(process.argv);

