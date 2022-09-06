
import * as utils from '../utils'

import { expect, server, spy } from '../utils'

import { Invoice } from '../../lib/invoices'

import { Wallets } from '../../lib/pay'

import * as Events from '../../lib/events'

class EdgeWallet {

  fetchPaymentRequest(invoice: Invoice, server) {

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

    let [account, invoice] = await utils.newAccountWithInvoice()

    let headers = wallet.getHeaders()

    expect(headers['x-requested-with']).to.be.equal('co.edgesecure.app')

    let response = await wallet.fetchPaymentRequest(invoice, server)

    expect(response.statusCode).to.be.equal(200)

  })

  it.skip('should detect and record when Edge requests a payment request', async () => {

    let [account, invoice] = await utils.newAccountWithInvoice()

    spy.on(Events, ['recordEvent'])

    let response = await wallet.fetchPaymentRequest(invoice, server)

    expect(Events.recordEvent).to.have.been.called.with({
      invoice_uid: invoice.uid,
      wallet: Wallets.Edge
    }, 'invoice.requested')

    let events = await Events.listEvents('invoice.requested', {
      invoice_uid: invoice.uid,
      wallet: Wallets.Edge
    })

    expect(events.length).to.be.equal(1)

    expect(events[0].get('wallet')).to.be.equal(Wallets.Edge) 

    events = await Events.listInvoiceEvents(invoice, 'invoice.requested')

    expect(events.length).to.be.equal(1)

  })

  it('payment-verification step should reject with incorrect number of outputs', async () => {


  })


  it('should detect and record when Edge submits a payment request', async () => {


  })


})
