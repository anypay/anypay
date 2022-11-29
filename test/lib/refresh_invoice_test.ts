
import { findOrCreateWalletBot } from '../../apps/wallet-bot'

import { refreshInvoice } from '../../lib/invoice'

import { findAll, findOne } from '../../lib/orm'

import { Invoice } from '../../lib/invoices'

import { createAccount, expect } from '../utils'

import { PaymentOption } from '../../lib/payment_option'

describe("Refreshing Invoice Payment Options", () => {

  it("should retain the same output addresses", async () => {

    const account = await createAccount()

    const { walletBot } = await findOrCreateWalletBot(account)

    const paymentRequest = await walletBot.createInvoice({
      template: {
        currency: 'BSV',
        to: {
          address: '1SbmHpETuDdkLPAaFoY9GqMiHToCwMUNJ',  
          amount: 52.00,
          currency: 'EUR'
        }
      }
    })

    const invoice = await findOne<Invoice>(Invoice, {
      uid: paymentRequest.invoice_uid
    })

    const originalPaymentOptions = await findAll<PaymentOption>(PaymentOption, {
      uid: paymentRequest.invoice_uid
    })

    await refreshInvoice(invoice.uid)

    const newPaymentOptions = await findAll<PaymentOption>(PaymentOption, {
      uid: paymentRequest.invoice_uid
    })

    expect(newPaymentOptions.length).equals(originalPaymentOptions.length)

    originalPaymentOptions.forEach((option, index) => {

      expect(option.address).equals(newPaymentOptions[index].address)

      expect(option.currency).equals(newPaymentOptions[index].currency)

    })

  })

})
