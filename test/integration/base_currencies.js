import {Server, server} from '../../servers/rest_api/server';
import * as assert from 'assert';

const Database = require("../../lib/database");

import * as Chance from 'chance';
const chance = new Chance();

describe("Creating Bitcoin Cash Invoices Via REST", async () => {
  
  before(async () => {
    await Database.sync();
    await Server();
  });

  it("GET /base_currencies should return a list of base currencies", async () => {

    let response = await server.inject({
      method: 'GET',
      url: '/base_currencies',
    });

    assert(response.result.rates.BTC === 1); // BTC AS GLOBAL BASE 
    assert(response.result.rates.VEF > 0); // Venzuela
    assert(response.result.rates.USD > 0); // United States
    assert(response.result.rates.EUR > 0); // Euro
    assert(response.result.rates.COP > 0); // Colombian Peso
    assert(response.result.rates.ARS > 0); // Argentina
    assert(response.result.rates.CAD > 0); // Canada
    assert(response.result.rates.GHS > 0); // Ghana
  });

});

