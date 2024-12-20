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

import { createAccount, expect } from '@/test/utils'

import { createInvoice, findOrCreateWalletBot } from '@/apps/wallet-bot'

import { refreshInvoice } from '@/lib/invoice'  

import prisma from '@/lib/prisma'

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
          uid: String(paymentRequest.invoice_uid)
        }
      })

      const originalPaymentOptions = await prisma.payment_options.findMany({
        where: {
          invoice_uid: String(paymentRequest.invoice_uid)
        }
      })
      
      await refreshInvoice(invoice.uid)

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
