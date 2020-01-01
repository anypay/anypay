#!/usr/bin/env ts-node

require('dotenv').config();

import * as uuid from 'uuid';

import * as http from 'superagent';

import { models } from '../lib';

import * as square from '../lib/square';

import * as program from 'commander';

var SquareConnect = require('square-connect');

program
  .command('gettoken <code>')
  .action(async (code) => {

    try {

      let resp = await http
        .post('https://connect.squareup.com/oauth2/token')
        .set('Square-Version', '2019-12-17')
        .send({
          client_id: process.env.SQUARE_OAUTH_APPLICATION_ID,
          client_secret: process.env.SQUARE_OAUTH_APPLICATION_SECRET,
          grant_type: 'authorization_code',
          code
        })

      console.log(resp.body);

    } catch(error) {

      console.log(error.response.body);

    }

    process.exit(0);

  });

program
  .command('listlocations')
  .action(async () => {

    let squareClient = new square.SquareOauthClient(process.env.SQUARE_OAUTH_ACCESS_TOKEN);

    try {

      let locations = await squareClient.listLocations();

      console.log(locations);

    } catch(error) {

      console.log(error.message);

    }

    process.exit(0);

  });

program
  .command('listcatalog')
  .action(async () => {

    let squareClient = new square.SquareOauthClient(process.env.SQUARE_OAUTH_ACCESS_TOKEN);

    try {

      let catalog = await squareClient.listCatalog();

      catalog.objects.forEach(catalogObject => {

        if (catalogObject.type === 'ITEM') {
          console.log(catalogObject);
        }

      });


    } catch(error) {

      console.log('error', error);

    }

    process.exit(0);

  });

program
  .command('getcatalogobject <object_id>')
  .action(async (objectId) => {

    let squareClient = new square.SquareOauthClient(process.env.SQUARE_OAUTH_ACCESS_TOKEN);

    try {

      let catalogObject = await squareClient.getCatalogObject(objectId);

      console.log('catalog object', catalogObject);

    } catch(error) {

      console.log('error', error);

    }

    process.exit(0);

  });




program
  .command('createorder')
  .action(async () => {


    try {

      let locationId = "VDT4P5TBDZGE8";
      let catalogObjectId = "UVPRW4IZP2623CB4Z5ZLTACF";

      let uid = uuid.v4();

      let resp = await square.grabAndGoCreateOrder(uid, locationId);

      console.log(JSON.stringify(resp));

    } catch(error) {

      console.error(error);
    }

    process.exit(0);

  });

program.parse(process.argv);
g
