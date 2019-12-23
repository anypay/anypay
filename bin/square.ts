#!/usr/bin/env ts-node

require('dotenv').config();

import * as uuid from 'uuid';

import { models } from '../lib';

import { grabAndGoCreateOrder } from '../lib/square';

import * as program from 'commander';

var SquareConnect = require('square-connect');

program
  .command('listlocations')
  .action(async () => {

    try {
      // Pass client to API
      var api = new SquareConnect.LocationsApi();

      let data:any = await api.listLocations();

      console.log(JSON.stringify(data));

    } catch(error) {

      console.error(error.message);

    }

    process.exit(0);

  });

program
  .command('listcatalog')
  .action(async () => {

    try {
      // Pass client to API
      var api = new SquareConnect.CatalogApi();

      let data:any = await api.listCatalog();

      console.log(JSON.stringify(data));

    } catch(error) {
      console.error(error.message);
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

      let resp = await grabAndGoCreateOrder(uid, catalogObjectId, locationId);

      console.log(JSON.stringify(resp));

    } catch(error) {

      console.error(error);
    }

    process.exit(0);

  });

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

program.parse(process.argv);

