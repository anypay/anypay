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

program.parse(process.argv);

