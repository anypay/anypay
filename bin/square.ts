#!/usr/bin/env ts-node

require('dotenv').config();

import * as uuid from 'uuid';

import * as http from 'superagent';

import * as square from '../lib/square';

import { models } from '../lib';

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
          console.log(catalogObject.item_data.name);
        }

      });


    } catch(error) {

      console.log('error', error);
    }

  });

program
  .command('createorder <invoice_uid>')
  .action(async (uid) => {

    try {

      let resp = await square.grabAndGoCreateOrder(uid);

      console.log(JSON.stringify(resp));

    } catch(error) {

      console.error(error);
    }

    process.exit(0);

  });

program
  .command('getorder <account_id> <order_id>')
  .action(async (orderId) => {

    try {

      /*let resp = await square.getOrder(orderId);

      console.log(JSON.stringify(resp));
      */

    } catch(error) {

      console.error(error);
    }

    process.exit(0);

  });

program
  .command('getcatalogobject <object_id>')
  .action(async (objectId) => {

    let squareClient = new square.SquareOauthClient(process.env.SQUARE_OAUTH_ACCESS_TOKEN);

    try {

      let catalogObject = await squareClient.getCatalogObject(objectId);

      console.log(catalogObject.object);
      console.log(catalogObject.object.item_data);
      catalogObject.object.item_data.variations.forEach(console.log);

    } catch(error) {

      console.log('error', error);

    }

    process.exit(0);

  });
  /*

program
  .command('obtaintoken <code>')
  .action(async (code) => {

    try {

      var SquareConnect = require('square-connect');

      var apiInstance = new SquareConnect.OAuthApi();

      var body = {
        code,
        grant_type: 'authorization_code',
        client_id: process.env.SQUARE_OAUTH_APPLICATION_ID,
        client_secret: process.env.SQUARE_OAUTH_APPLICATION_SECRET
        //redirect_uri: 'http://127.0.0.1:5200/auth/square/callbacks'
      };

      var req = new SquareConnect.ObtainTokenRequest(body);

      console.log(body);

      let data = await apiInstance.obtainToken(body);

      console.log(data);

    } catch(error) {

      console.error(error);
    }

    process.exit(0);

  });


program
  .command('importgrabandgo <accountId>')
  .action(async (accountId) => {

    try {

      let squareClient = new square.SquareOauthClient(token);

      let catalog = squareClient.listCatalog();

      let importer = squareClient.importCatalogToGrabAndGo(accountId);

      importer.on('created', (item) => console.log('item.created', item));

      importer.on('updated', (item) => console.log('item.updated', item));

      importer.on('complete', () => process.exit(0));

      // begin grab and go import

      // get grab and go items

      // import grab and go items

      // end import and report success or failure

    } catch(error) {

      console.error(error);
    }

    process.exit(0);

  });
  */

program.parse(process.argv);


