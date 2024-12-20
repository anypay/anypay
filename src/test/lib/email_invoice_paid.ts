/*
    This file is part of anypay: https://github.com/anypay/anypay
    Copyright (c) 2017 Anypay Inc, Steven Zeiler

    Permission to use, copy, modify, and/or distribute this software for any
    purpose  with  or without fee is hereby granted, provided that the above
    copyright notice and this permission notice appear in all copies.

    THE  SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
    WITH  REGARD  TO  THIS  SOFTWARE  INCLUDING  ALL  IMPLIED  WARRANTIES  OF
    MERCHANTABILITY  AND  FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
    ANY  SPECIAL ,  DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
    WHATSOEVER  RESULTING  FROM  LOSS  OF USE, DATA OR PROFITS, WHETHER IN AN
    ACTION  OF  CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
    OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
//==============================================================================

import assert from 'assert'
import {accounts} from '@/lib';
import * as email from '@/lib/email';
import {setAddress} from '@/lib/core';
import {createInvoice} from '@/lib/invoices';

import Chance from 'chance';
const chance = new Chance();

describe("Emails when invoice is paid", ()=>{

  var account,invoice1: any;

  before(async()=>{

    account = await accounts.create(chance.email(), chance.word())

    await setAddress({
      account_id:account.id,
      currency:"XRP",
      chain:"XRP",
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
