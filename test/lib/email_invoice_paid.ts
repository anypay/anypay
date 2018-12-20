import * as assert from 'assert'
import * as lib from '../../lib';
import {setAddress} from '../../lib/core';
import {generateInvoice} from '../../lib/invoice';
import {handlePayment} from '../../lib/payment_processor';
import * as Chance from 'chance';
const chance = new Chance();
import {emitter} from '../../lib/events'

describe("Emails when invoice is paid", ()=>{

  var account,invoice1, invoice2;

  before(async()=>{

    account = await lib.accounts.create(chance.email(), chance.word())

    await setAddress({
      account_id:account.id,
      currency:"XRP",
      address:"rEdid5kDsz8U4jGqkkvrPgRHpsKQ8gESsG"
    })

    invoice1 = await generateInvoice(account.id, 10, 'XRP');

    invoice2 = await generateInvoice(account.id, 1, 'XRP');

  })

  it("should emit an event when the first invoice is paid", (done)=>{

    let sem = false 

    emitter.on('invoice.paid', (p)=>{
      if(!sem){
        done()
      }
      assert(p)
      sem = true
    })

    let payment = {
      currency: "XRP",
      amount: invoice1.invoice_amount,
      address: invoice1.address,
      hash: 'f2fbd4fbb4bb84a22b9be5734473e90e7c8b7465ed8f49e983e73346681635a8'
    };
    handlePayment(invoice1, payment);


  })

  it.skip("should emit an event when an invoice is paid", (done)=>{

    let sem = false 

    emitter.on('invoice.paid', (p)=>{
      if(!sem){
	done()
      }
      assert(p)
      sem = true
    })

    let payment = {
      currency: "XRP",
      amount: invoice2.invoice_amount,
      address: invoice2.address,
      hash: 'f2fbd4fbb4bb84a22b9be5734473e90e7c8b7465ed8f49e983e73346681635a8'
    };
    handlePayment(invoice2, payment);

  });

});
