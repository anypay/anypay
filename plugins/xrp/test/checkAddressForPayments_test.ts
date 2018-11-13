require('dotenv').config();

require('../../../actors/payment_publisher')

import{emitter} from '../../../lib/events'

import {checkAddressForPayments} from '../';

require('dotenv').config();

import * as assert from 'assert'

describe("Checking address for payments", () => {

  it ("should return an array of payments", (done) => {

    let sem = false

    emitter.on('payment',(p)=>{
      if(!sem){
        done()
	}
      assert(p)
      sem = true;
    })
    let address = 'r3pzYrVu7oruSJh1jhACmb6wRDkTWVw1JJ';

    checkAddressForPayments(address, 'XRP');

  });

});
