import {models, routes, invoices, accounts}  from '../../lib';
const assert = require('assert');
import * as Chance from 'chance';
import * as bitcore from 'bitcore-lib';
import {setAddress} from '../../lib/core';

const chance = new Chance();

 
describe("Routes Library", ()=>{

  
  it("Should create an address route for an invoice", async ()=>{

  let account = await accounts.registerAccount(chance.email(), chance.word());

    await setAddress({
      account_id: account.id,
      currency: "BTC",
      address: "1Xy6Gh6zGghVHw3vkPsRb2KMXQbNQiG1b"
    });
    
   let invoice = await  models.Invoice.create({
      account_id: account.id,
      currency: 'BTC',
      invoice_amount: 100,
      amount: 0.1,
      denomination: "USD",
      denomination_currency: "USD",
      invoice_currency: "BTC",
      denomination_amount: 100,
      address: '1Xy6Gh6zGghVHw3vkPsRb2KMXQbNQiG1b',
      status: 'unpaid'

   })

   let route = await routes.createAddressRoute(invoice);
   
   assert.equal(route.output_address, '1Xy6Gh6zGghVHw3vkPsRb2KMXQbNQiG1b');
   assert.equal(route.output_currency, 'BTC');
   assert.equal(route.input_currency, 'BTC');
   assert(bitcore.Address.isValid(route.input_address));

  })


})
