require('dotenv').config()

const address = '43iJfB8tYGFCBNEc8rjJnWHfrXzUapbeifsmS5S9wBEPEzGBCgogtCZSkHaU68UBMWG5pRXk56g7CekSZo7bYkyuNq52Dtn'

const view_key = 'f30ef174be8249eb57a0a215339ae653f3c1034bb1e8eb76fa32b83b817fa10b'

import { setAddress } from '../../lib/addresses'

import { createInvoice } from '../../lib/invoices'

import { findPaymentOption } from '../../lib/payment_option'

import * as utils from '../utils'

import { expect } from '../utils'

describe("Monero XMR", () => {

  describe("Account / Address Setup", () => {

    it('accepts  both address and view key', async () => {

      let account = await utils.createAccount()

      let record = await setAddress(account, {
        currency: 'XMR',
        view_key,
        value: address
      })

      expect(record.get('id')).to.be.greaterThan(0)

      expect(record.get('account_id')).to.be.equal(account.id)

      expect(record.get('view_key')).to.be.equal(view_key)

      expect(record.get('value')).to.be.equal(address)

    })

    it.skip('rejects without both address and view key', async () => {

      let account = await utils.createAccount();

      /*expect(

        setAddress(account, {
          currency: 'XMR',
          value: address
        })

      ).to.be.eventually.rejected()
      */

    })

  })

  describe("Payments", () => {

    var account;

    before(async () => {

      account = await utils.createAccount() 

      await setAddress(account, {
        currency: 'XMR',
        value: address,
        view_key
      })

    })

    it('generates an invoice with monero payment option', async () => {

      let invoice = await createInvoice({
        account,
        amount: 10
      })

      let option = await findPaymentOption(invoice, 'XMR')

      expect(option.get('id')).to.be.greaterThan(0)

      expect(option.amount).to.be.greaterThan(0)

      expect(option.get('currency')).to.be.equal('XMR')

      expect(option.get('outputs').length).to.be.equal(1)

    })
 
    it('a wallet chooses xmr on the "payment-option" call')

    it('can be multiple output')

    it('can be single output')

    it('calls plugin.validateUnsignedTx on "payment-verification" call')

    it('calls plugin.submitSignedTx on "payment" call')

  })

})
