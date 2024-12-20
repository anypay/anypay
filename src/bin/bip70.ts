#!/usr/bin/env ts-node
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

require('dotenv').config()

import { Command } from 'commander';

const program = new Command();

import * as pay from '@/lib/pay'

let dashHex =
'0a06edd2f21748b812b9030100000002e3e20ed7c7bf90798b8dd0f36b0117cd8e9ef40f448c4caa6ece0212bf966c5b030000006a47304402200c8bb2546d7e0cdfb1e603e444ae52f8deb12cd50d7063ad6eb76acc155630630220042aa6727f381dafd2a30a42443140798a673a229363e119986433487fb3da04012103d320a88c1f39bf195a10fd223d2dd507224a624c1dae06ea1259e1233721919effffffff6d23ed1412f07794c3394a897b4b8ea0e4b805faf41d3ec3cc14e05683b650ce000000006b483045022100cd0ce7da220e03c7e14b58110e9bf2bb593a5128aeed1eadfc54a9192de844ea0220550cb39fcd13c9f7176c31f40aab4d8e284da1d4731d942b5fc9b60b008230bb012103d320a88c1f39bf195a10fd223d2dd507224a624c1dae06ea1259e1233721919effffffff04a0cd0000000000001976a91447d6cb12d55ea5ec1c61226776aa10ed61e1f12d88acc8320000000000001976a914e6632c8ec5817c9ad7ef1b5ea30f4cb30d2f693488ac20290000000000001976a91489517b1e75ba23562b00520819a05164c8ba290588acec2a0000000000001976a914a2807cad3fa39f122fb311815e3e99d4e8a9df1c88ac000000001a1f0888d304121976a9142026714773dd58804933ebb668e95a12dda2805688ac'

program
  .command('decodepayment <hex>')
  .action(async (hex) => {

    let payment = pay.BIP70Protocol.Payment.decode(dashHex);

    console.log(payment)

  })

program
  .command('parsepaymentrequest <invoice_uid> <currency>')
  .action(async (invoice_uid, currency) => {

    let paymentRequest: pay.PaymentRequest = await pay.buildPaymentRequestForInvoice({
      uid: invoice_uid,
      currency,
      protocol: 'BIP70'
    })

    let hex = paymentRequest.content.serialize().toString('hex')

    let decoded = pay.bip70.paymentRequestToJSON(hex, currency)

    console.log(decoded)

    process.exit(0)

  })

program.parse(process.argv)
