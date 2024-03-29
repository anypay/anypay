
import { createAccount, expect } from '../utils'

import { createInvoice, findOrCreateWalletBot } from '../../apps/wallet-bot'

import { refreshInvoice } from '../../lib/invoice'

import prisma from '../../lib/prisma'

describe("Refreshing Invoice Payment Options", () => {

  it("should retain the same output addresses", async () => {

      const account = await createAccount()

      const { walletBot } = await findOrCreateWalletBot(account)

      const paymentRequest = await createInvoice(walletBot, {
        template: {
          currency: 'BSV',
          to: {
            address: '1SbmHpETuDdkLPAaFoY9GqMiHToCwMUNJ',  
            amount: 52.00,
            currency: 'USD'
          }
        }
      })

      const invoice = await prisma.invoices.findFirstOrThrow({
        where: {
          uid: paymentRequest.invoice_uid
        }
      })

      const originalPaymentOptions = await prisma.payment_options.findMany({
        where: {
          invoice_uid: String(paymentRequest.invoice_uid)
        }
      })

      await refreshInvoice(String(invoice.uid))

      const newPaymentOptions = await prisma.payment_options.findMany({
        where: {
          invoice_uid: String(paymentRequest.invoice_uid)
        }
      })


      expect(newPaymentOptions.length).equals(originalPaymentOptions.length)

      originalPaymentOptions.forEach((option, optionIndex) => {

        const outputs = option.outputs as Array<any> || []

        outputs.forEach((oldOutput, outputIndex) => {

          const newOption = newPaymentOptions[optionIndex]

          const newOutputs = newOption.outputs as Array<any>

          const newOutput = newOutputs[outputIndex]

          expect(oldOutput.address)
            .equals(newOutput.address)

          expect(oldOutput.currency)
            .equals(newOutput.currency)

        })

      })

  })

})
