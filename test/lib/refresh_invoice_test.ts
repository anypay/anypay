
import { createAccount, expect } from '../utils'

import { findOrCreateWalletBot } from '../../apps/wallet-bot'

import { refreshInvoice } from '../../lib/invoice'

import { findOne } from '../../lib/orm'

import { Invoice } from '../../lib/invoices'

import { models } from '../../lib/models'

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
            currency: 'USD'
          }
        }
      })

      const invoice = await findOne<Invoice>(Invoice, {
        where:{ uid: paymentRequest.invoice_uid }
        
      })

      const originalPaymentOptions = await models.PaymentOption.findAll({
        where: {
          invoice_uid: paymentRequest.invoice_uid
        }
      })

      await refreshInvoice(invoice.uid)

      const newPaymentOptions = await models.PaymentOption.findAll({
        where: {
          invoice_uid: paymentRequest.invoice_uid
        }
      })

      expect(newPaymentOptions.length).equals(originalPaymentOptions.length)

      originalPaymentOptions.forEach((option, optionIndex) => {

        option.outputs.forEach((oldOutput, outputIndex) => {

          const newOutput = newPaymentOptions[optionIndex].outputs[outputIndex]

          expect(oldOutput.address)
            .equals(newOutput.address)

          expect(oldOutput.currency)
            .equals(newOutput.currency)

        })

      })

  })

})
