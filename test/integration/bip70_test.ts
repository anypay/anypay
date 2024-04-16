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
import { expect, request, account } from '../utils'

import * as utils from '../utils'

describe("End To End Payment Requests With BIP70 Protobufs", () => {

  describe("BCH", () => {

    it('should return a valid BIP70 payment request', async () => {

      let invoice = await utils.newInvoice({ amount: 0.02, account })

      let resp = await request
        .get(`/r/${invoice.uid}`) 
        .set({
          'Accept': 'application/bitcoincash-paymentrequest',
          'x-currency': 'BCH'
        })

      expect(resp.statusCode).to.be.equal(200)

    })

  })

  describe("BTC", () => {

    it.skip('should return a valid BIP70 payment request', async () => {

      const account = await utils.generateAccount()


      let invoice = await utils.newInvoice({ amount: 0.02, account })

      let resp = await request
        .get(`/r/${invoice.uid}`) 
        .set({
          'Accept': 'application/bitcoin-paymentrequest',
          'x-currency': 'BTC'
        })

      expect(resp.statusCode).to.be.equal(200)

    })
  
  })

  describe("DASH", () => {

    it('should return a valid BIP70 payment request', async () => {

      let invoice = await utils.newInvoice({ amount: 0.02, account })

      let resp = await request
        .get(`/r/${invoice.uid}`) 
        .set({
          'Accept': 'application/dash-paymentrequest',
          'x-currency': 'DASH'
        })

      console.log(resp)

      expect(resp.statusCode).to.be.equal(200)

    })
  
  })

})
