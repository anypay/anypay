require('dotenv').config();

import {Server} from '../server';
import * as assert from 'assert';

import {setAddress} from '../../../lib/core';

import { models, database, accounts, prices } from "../../../lib";

import * as Chance from 'chance';
const chance = new Chance();

describe("Create Grab and Go Payment Request", async () => {
 var account, server;
  
  before(async () => {

    server = await Server();

    await prices.setPrice('BCH', 0.05, 'static', 'USD');

    account = await accounts.registerAccount(chance.email(), chance.word());

    await setAddress({
      account_id: account.id,
      currency: 'BCH',
      address: 'bitcoincash:qqdg7dyhx5ulan73pr2dvm03upatussskyseckns7e'
    }); 

    let name = `${chance.word()} ${chance.word()} ${chance.word()}`;

    let stub = name.replace(/\ /g, '-').toLowerCase();

    account.business_name = name;
    account.stub = stub;

    await account.save();
  
  });

  it("GET /grab-and-go/:account/:item/purchases/new should return payment request", async () => {
 
    let name = `${chance.word()} ${chance.word()} ${chance.word()}`;

    let stub = name.replace(/\ /g, '-').toLowerCase();

    let item = await models.Product.create({

      price: 12,

      account_id: account.id,

      name,

      stub

    });
    console.log('url', '/grab-and-go/${account.stub}/${item.stub}/purchases/new');
 
    try {

      let response = await server.inject({
        method: 'GET',
        url: `/grab-and-go/${account.stub}/${item.stub}/purchases/new`,
      });

      console.log('payment request', response.result);

    } catch(error) {

      console.error('ERROR', error.message);
      throw error;

    }
  });

});

