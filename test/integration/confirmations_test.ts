require('dotenv').config()

import { confirmTransactionsFromBlockWebhook } from '../../lib/blockcypher'

import { expect, generateAccount, newInvoice } from '../utils'

import * as fixtures from '../fixtures'
import { recordPayment } from '../../lib/payments'

import { setAddress } from '../../lib/core'
import { models } from '../../lib'
import prisma from '../../lib/prisma'

describe("Confirming Transactions", () => {

    it.skip('should change from unpaid to confirming when BTC payment received', async () => {

    })

    it.skip('should change from confirming to confirmed when blockcypher webhook received', async () => {
	// try again with new blockcypher token or another strategy. This is failing with 429 on the token

        const account = await generateAccount()

        await setAddress({
            account_id: account.id,
            currency: 'BTC',
            chain: 'BTC',
            address: fixtures.BTC_Confirmation_Test.address
          })

        let invoice = await newInvoice({ account, amount: 100 })

        expect(invoice.status).to.be.equal('unpaid')

        let payment = await recordPayment(invoice, {
            txid: fixtures.BTC_Confirmation_Test.txid,
            currency: 'BTC',
            txhex: fixtures.BTC_Confirmation_Test.txid
        })

        expect(payment.status).to.be.equal('confirming')

        await prisma.invoices.update({
            where: {
                id: invoice.id
            },
            data: {
                status: 'confirming',
                hash: fixtures.BTC_Confirmation_Test.txid
            }
        })

        await confirmTransactionsFromBlockWebhook(fixtures.BTC_Confirmation_Test.blockcpher_webhook_payload)    
        payment = await prisma.payments.findFirstOrThrow({
            where: {
                invoice_uid: String(invoice.uid)
            }
        })    

        invoice = await prisma.invoices.findFirstOrThrow({
            where: {
                uid: String(invoice.uid)
            }
        })

        expect(payment.status).to.be.equal('confirmed')

        expect(invoice.status).to.be.equal('paid')

    })

})
