#!/usr/bin/env ts-node

import * as program from 'commander';

import * as http from 'superagent'

program
  .command('generatecode')
  .action(async () => {

    let place = 'ChIJrTtOeQu_4okRBoiuYJEQGJ8';

    try {

      let resp = await http
        .post('https://truereviews.io/api/anypay/token')
        .set('trApiKey', 'anypaydev')
        .send({
          data: {
            location: place
          },
          amount: "$5.00"
        })

      console.log(resp.body);

    } catch(error) {

      console.log(error)

    }


    process.exit(0);

  });


program.parse(process.argv);
