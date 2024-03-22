
import * as utils from '../utils'

import { expect, generateAccount, server, spy } from '../utils'

import { Invoice } from '../../lib/invoices'

import { Wallets } from '../../lib/pay'

import * as Events from '../../lib/events'
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

    const account = await generateAccount()

    let invoice = await utils.newInvoice({ amount: 0.02, account })

    let headers = wallet.getHeaders()

    expect(headers['x-requested-with']).to.be.equal('co.edgesecure.app')

    let response = await wallet.fetchPaymentRequest(invoice, server)

    expect(response.statusCode).to.be.equal(200)

  })

  it.skip('should detect and record when Edge requests a payment request', async () => {

    const account = await generateAccount()

    let invoice = await utils.newInvoice({ amount: 0.02, account })

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
