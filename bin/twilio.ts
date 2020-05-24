#!/usr/bin/env ts-node

import * as program from 'commander';

require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

console.log('SID', accountSid);
console.log('TOKEN', authToken);

//const client = require('twilio')(accountSid, authToken);
const client = require('twilio')('AC5fe88dd6a6ba7ea7e0f280831ae8bdfc', 'ce0b4b545c27f657917e540ffc084d47');
//const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

program
  .command('sendsms')
  .action(async () => {

    try {

      let result = await sendText('+14154072789');

    } catch(error) {

      console.log(error);
    }

  })

program
  .command('makecall')
  .action(async () => {

    twilioCall('+14154072789');

  })


function twilioCall(phoneNumber) {

  client.calls
    .create({
       url: 'https://bico.media/27c503df1faa70b4c8a5c37ac127808597a9c93e6b7ebf5e74f12a1deedbeea2.xml',
       to: phoneNumber,
       from: '+14154072789'
     })
    .then(call => console.log(call.sid))
    .catch(error => {
      console.log(error);
      console.log(error.message);
    });
}

async function sendText(phoneNumber) {

  let message = await client.messages
    .create({
       body: 'https://bico.media/27c503df1faa70b4c8a5c37ac127808597a9c93e6b7ebf5e74f12a1deedbeea2.xml',
       to: phoneNumber,
       from: '+18026130753'
     })

  console.log(message);

  return message;
}



program.parse(process.argv);

