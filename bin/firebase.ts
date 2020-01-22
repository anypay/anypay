#!/usr/bin/env ts-node

import * as program from 'commander';

import { join } from 'path';

import { ensureVariable } from '../lib/environment';

import * as firebase from 'firebase-admin';

program
  .command('sendpushnotification <token> <message>')
  .action(async (token, message) => {

    var serviceAccount = require(
      join(
        __dirname,
        '../firebase/anypay-c906a-firebase-adminsdk-q3jsf-68d1ad383e.json'
      )
    );

    let databaseURL = ensureVariable('FIREBASE_URL');

    console.log(databaseURL);

    firebase.initializeApp({
      credential: firebase.credential.cert(serviceAccount),
      databaseURL
    });

    const payload = {
      notification: {
        title: 'Notification Title',
        body: 'This is an example notification',
      }
    };

    const options = {
      priority: 'high',
      timeToLive: 60 * 60 * 24, // 1 day
    };

    var message: any = {
      data: {
        score: '850',
        time: '2:45'
      },
      token
    };

    // Send a message to the device corresponding to the provided
    // registration token.

    try {

      let resp = await firebase.messaging().send(message)

      //let resp = await firebase.messaging().sendToDevice(token, payload, options);

      console.log('resp', resp);

    } catch(error) {

      console.log(error);

    }

    process.exit(0);
    
  });

program
  .parse(process.argv);
