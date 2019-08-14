
import {getNewAddress} from '../plugins/btc'

import {show} from '../servers/rest_api/handlers/address_routes';



import { generateInvoice } from '../lib/invoice';
import { replaceInvoice } from '../lib/invoice';
import { settleInvoice } from '../lib/invoice';
import { registerAccount } from '../lib/accounts';
import { setAddress, setDenomination } from '../lib/core';
import * as assert from 'assert';

import * as Chance from 'chance';
import * as moment from 'moment';

const chance = new Chance();



describe("create new address for BTC", async () => {

  it("Should return an HDKeyAddress", async () => {

    let btc = await getNewAddress(null)

     assert(btc)

  });

});

describe("Returning routes", async ()=>{

  it("should return a route with an HDkey", async ()=>{

    let input = {
     input_address: 'CL56FMi7gfTiW1GHH3L2mejua4g89dwtJ3',
     input_currency: 'BTC'
    }
    let req = {} 

    req['params'] = input


     let route = await show(req, null)

     console.log(route)

     assert(route)
    

  });


});

describe("Creating Invoices", () => {

  it("#generateInvoice should create a new BTC invoice and return proper route with HDkey", async () => {

    let account = await registerAccount(chance.email(), chance.word());

    await setAddress({
      account_id: account.id,
      currency: "BTC",
      address: "1NxyK6v77EnGPhbhX1fwxB5ptXeAc3bN6a"
    });

    var amount = {
      currency: 'USD',
      value: 15000000
    };

    await setDenomination({
      account_id: account.id,
      currency: amount.currency
    });

    let invoice = await generateInvoice(account.id, amount.value, 'BTC');
    let input = {
     input_address: invoice.address,
     input_currency: invoice.currency
    }
    let req = {} 

    req['params'] = input


     let route = await show(req, null)

     console.log(route)

     assert(route.HDKeyAddress) 

  });


  it("#generateInvoice should create a new DASH invoice and not return a route with HDkey", async () => {

    let account = await registerAccount(chance.email(), chance.word());

    await setAddress({
      account_id: account.id,
      currency: "DASH",
      address: "Xu87fWdjhZHX4vAvcqnE9nbfSuPp5EwBSY"
    });

    var amount = {
      currency: 'USD',
      value: 15000000
    };

    await setDenomination({
      account_id: account.id,
      currency: amount.currency
    });

    let invoice = await generateInvoice(account.id, amount.value, 'DASH');

    let input = {
     input_address: invoice.address,
     input_currency: invoice.currency
    }
    let req = {} 

    req['params'] = input


     let route = await show(req, null)

     assert(!route.HDKeyAddress) 

  });


});


