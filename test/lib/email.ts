import * as assert from 'assert'
import * as lib from '../../lib';
import {setAddress} from '../../lib/core';
import {generateInvoice} from '../../lib/invoice';
import {handlePayment} from '../../lib/payment_processor';
import * as Chance from 'chance';
const chance = new Chance();
import {emitter} from '../../lib/events'

describe("Automated Emails", ()=>{

 describe("New account creation email", ()=>{

   it("should emit an emit an event when a new account is created", (done)=>{

      let sem = false 

      emitter.on('account.created', (p)=>{
	if(!sem){
	  done()
	}
	assert(p)
	sem = true
      })

      lib.accounts.create(chance.email(), chance.word())


   })

  })

  describe("Set Address emails", ()=>{

    var account;

    before(async()=>{

      account = await lib.accounts.create(chance.email(), chance.word())

    })

   it("should emit an event when an address is updated", (done)=>{

      let sem = false 

      emitter.on('address.set', (p)=>{
	if(!sem){
	  done()
	}
	assert(p)
	sem = true
      })

      setAddress({
        account_id: account.id,
	currency: "XRP",
        address: "r3pzYrVu7oruSJh1jhACmb6wRDkTWVw1JJ"
      });

    })

  })

  describe("Invoice emails", ()=>{

    var account;

    before(async()=>{

      account = await lib.accounts.create(chance.email(), chance.word())

      await setAddress({
        account_id: account.id,
        currency: "XRP",
        address: "r3pzYrVu7oruSJh1jhACmb6wRDkTWVw1JJ"
      });

    })

    it("should emit an event when the first invoice is created for the first time", (done)=>{

      let sem = false 

      emitter.on('invoice.created.first', (p)=>{
	if(!sem){
	  done()
	}
	assert(p)
	sem = true
      })
      
      generateInvoice(account.id, 10, 'XRP');

    })
   
    it.skip("should emit an event an invoice is created", (done)=>{

      let sem = false 

      emitter.on('invoice.created', (p)=>{
	if(!sem){
	  done()
	}
	assert(p)
	sem = true
      })
      
      generateInvoice(account.id, 10, "XRP");

    })   

  });

});

