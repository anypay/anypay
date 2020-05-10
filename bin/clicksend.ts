#!/usr/bin/env ts-node

import * as program from 'commander';

require('dotenv').config();

import { clicksend } from '../lib';

program
  .command('sendpostcard')
  .action(async () => {

    try {

      let resp = await clicksend.sendPostcard({ 
        address_name: 'Astra Lounge',
        address_line_1: '61 Penhallow St',
        address_line_2: '',
        address_city: 'Portsmouth',
        address_state: 'NH',
        address_postal_code: '03801',
        address_country: 'US',
        return_address_id: 77260
      }, [
        "https://s3-ap-southeast-2.amazonaws.com/clicksend-api-downloads/_public/_examples/a5_front.pdf",
        "https://s3-ap-southeast-2.amazonaws.com/clicksend-api-downloads/_public/_examples/a5_back.pdf"
      ]);

      console.log(resp);

    } catch(error) {

      console.log(error);
      console.log(error.message);

    }

    process.exit(0);

  });

program
  .command('listreturnaddresses')
  .action(async () => {

    try {

      let resp = await clicksend.listReturnAddresses()

      console.log(resp);

    } catch(error) {

      console.log(error);
      console.log(error.message);

    }

    process.exit(0);

  });

program
  .command('sendpostcardtogoogleplace [place_id]')
  .action(async (place_id='ChIJQRDK6A2_4okRfJjAI151uVo') => {
    // free state bitcoin shoppe

    try {

      let resp = await clicksend.sendToGooglePlace(place_id, [
        "https://s3-ap-southeast-2.amazonaws.com/clicksend-api-downloads/_public/_examples/a5_front.pdf",
        "https://s3-ap-southeast-2.amazonaws.com/clicksend-api-downloads/_public/_examples/a5_back.pdf"
      ]);

      console.log(resp);

    } catch(error) {

      console.log(error);
      console.log(error.message);

    }

    process.exit(0);

  });


program
  .command('createreturnaddress')
  .action(async () => {

    try {

      let resp = await clicksend.createReturnAddress({ 
        address_name: 'Astra Lounge',
        address_line_1: '61 Penhallow St',
        address_line_2: '',
        address_city: 'Portsmouth',
        address_state: 'NH',
        address_postal_code: '03801',
        address_country: 'US'
      });

      console.log(resp.text);

    } catch(error) {

      console.log(error);

    }

    process.exit(0);

  });

program.parse(process.argv);
