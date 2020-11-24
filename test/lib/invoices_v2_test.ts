
import { chance, assert } from '../utils'

import { v2 } from '../../lib/v2'

describe("Invoices V2", () => {

  describe("Creating An Invoice With Library", () => {
    var account;

    before(async () => {

      account = await v2.accounts.findOrCreate({
        where: {
          email: chance.email()
        },
        defaults: {
          email_verified: true
        }
      })

    })

    it("#should create an invoice for an existing account with no payment options", async () => {

      await account.addresses.unsetAll()

      let invoice = await account.invoices.create({
        currency: 'USD',
        amount: 10
      })

      assert.strictEqual(invoice.currency, 'USD')
      assert.strictEqual(invoice.amount, 10)

      assert.strictEqual(invoice.payment_options.length, 0)
      assert(invoice.uid)
      assert(invoice.uri)
      assert(invoice.web_url)
    })

    it("#should create an invoice for an existing account with one payment options", async () => {

      await account.addresses.unsetAll()
      await account.addresses.update('BCH', 'bitcoincash:qp2tqtmhm6ukrz0hnmxarqmdt2l4p38gdcwuxj40mr')

      let invoice = await account.invoices.create({
        currency: 'USD',
        amount: 10
      })

      assert.strictEqual(invoice.payment_options.length, 1)
      assert(invoice.payment_options[0].outputs.length > 0) // it has at least a single output to the destination address
      assert.strictEqual(invoice.payment_options[0].outputs[0].address, 'qp2tqtmhm6ukrz0hnmxarqmdt2l4p38gdcwuxj40mr')
      assert.strictEqual(invoice.payment_options[0].currency_name, 'Bitcoin Cash')

      assert(invoice.payment_options[0].currency_logo_url)
      assert(invoice.uid)
      assert(invoice.uri)
      assert(invoice.web_url)
    })

    it("should create an invoice for an existing account with two payment options", async () => {

      await account.addresses.unsetAll()
      await account.addresses.update('BCH', 'bitcoincash:qp2tqtmhm6ukrz0hnmxarqmdt2l4p38gdcwuxj40mr')
      await account.addresses.update('BSV', '1NS6SGu2yMecv4dRPTtHQzgC6so5wrvXYW')

      let invoice = await account.invoices.create({
        currency: 'USD',
        amount: 0.99
      })

      assert.strictEqual(invoice.payment_options.length, 2)
    })

    it("should allow for a webhook_url, redirect_url to be set", async () => {

      let invoice = await account.invoices.create({
        currency: 'USD',
        amount: 0.02,
        webhook_url: 'https://paypow.com/webhooks/anypay',
        redirect_url: 'https://paypow.com/anypay/redirect'
      })

      assert.strictEqual(invoice.webhook_url, 'https://paypow.com/webhooks/anypay')
      assert.strictEqual(invoice.redirect_url, 'https://paypow.com/anypay/redirect')
    })

  })


  describe("Creating An Invoice With HTTP", () => {

  })

})
