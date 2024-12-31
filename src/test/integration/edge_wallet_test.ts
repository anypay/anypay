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


import { expect, server, spy, account } from '@/test/utils'

import { Invoice, createInvoice } from '@/lib/invoices'

import { Wallets } from '@/lib/pay'

import * as Events from '@/lib/events'
import { Server } from '@hapi/hapi'

class EdgeWallet {

  fetchPaymentRequest(invoice: Invoice, server: Server) {

    return server.inject({
      method: 'GET',
      url: `/r/${invoice.uid}`,
      headers: this.getHeaders()
    })

  }

  getHeaders(headers: any = {}): any {

    return Object.assign(headers, {

      'x-requested-with': 'co.edgesecure.app'

    })

  }
}

describe('Payment Requests With Edge Wallet', () => {

  var wallet = new EdgeWallet()

  it('requests payments with edge-specific headers', async () => {

    let invoice = await createInvoice({ amount: 0.02, currency: 'USD', account })

    let headers = wallet.getHeaders()

    expect(headers['x-requested-with']).to.be.equal('co.edgesecure.app')

    let response = await wallet.fetchPaymentRequest(invoice, server)

    expect(response.statusCode).to.be.equal(200)

  })

  it.skip('should detect and record when Edge requests a payment request', async () => {

    let invoice = await createInvoice({ amount: 0.02, currency: 'USD', account })

    spy.on(Events, ['recordEvent'])

    expect(Events.recordEvent).to.have.been.called.with({
      invoice_uid: invoice.uid,
      wallet: Wallets.Edge
    }, 'invoice.requested')

    let events = await Events.listEvents('invoice.requested', {
      invoice_uid: invoice.uid,
      wallet: Wallets.Edge
    })

    expect(events.length).to.be.equal(1)

    expect((events[0].payload as any).wallet).to.be.equal(Wallets.Edge) 

    events = await Events.listInvoiceEvents(invoice, 'invoice.requested')

    expect(events.length).to.be.equal(1)

  })

  it.skip('payment-verification step should reject with incorrect number of outputs', async () => {


  })


  it.skip('should detect and record when Edge submits a payment request', async () => {


  })

})
