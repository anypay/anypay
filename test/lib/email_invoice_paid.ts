
import { assert, account } from '../utils'

import {email} from '../../lib';
import {setAddress} from '../../lib/core';
import {createInvoice} from '../../lib/invoices';

describe("Emails when invoice is paid", ()=>{

  var invoice1;

  before(async()=>{

    await setAddress({
      account_id:account.id,
      currency:"XRP",
      address:"rEdid5kDsz8U4jGqkkvrPgRHpsKQ8gESsG"
    })

    invoice1 = await createInvoice({
      account,
      amount: 10
    })

  })

  it("should send email when an invoice is paid", async ()=>{

    let resp = await email.invoicePaidEmail(invoice1.toJSON())
    assert(resp.MessageId)

  })

});
