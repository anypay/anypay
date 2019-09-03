import * as assert from 'assert'
import {email, accounts} from '../../lib';
import {setAddress} from '../../lib/core';
import {generateInvoice} from '../../lib/invoice';
import {handlePayment} from '../../lib/payment_processor';
import * as Chance from 'chance';
const chance = new Chance();

describe("Emails when invoice is paid", ()=>{

  var account,invoice1, invoice2;

  before(async()=>{

    account = await accounts.create(chance.email(), chance.word())

    await setAddress({
      account_id:account.id,
      currency:"XRP",
      address:"rEdid5kDsz8U4jGqkkvrPgRHpsKQ8gESsG"
    })

    invoice1 = await generateInvoice(account.id, 10, 'XRP');

  })

  it("should send email when an invoice is paid", async ()=>{

    let resp = await email.invoicePaidEmail(invoice1.toJSON())
    console.log(resp)
    assert(resp)

  })

});
