require('dotenv').config()

import { confirmTransactionsFromBlockWebhook } from '../../lib/blockcypher'

import { expect, newInvoice, account } from '../utils'

import * as fixtures from '../fixtures'
import { recordPayment } from '../../lib/payments'

import { setAddress } from '../../lib/core'
import { models } from '../../lib'

describe("Confirming Transactions", () => {

    it.skip('should change from unpaid to confirming when BTC payment received', async () => {

    })

    it.skip('should change from confirming to confirmed when blockcypher webhook received', async () => {
	// try again with new blockcypher token or another strategy. This is failing with 429 on the token

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

        expect(payment.get('status')).to.be.equal('confirming')

        await invoice.set('status', 'confirming')

        await invoice.set('hash', fixtures.BTC_Confirmation_Test.txid)

        await confirmTransactionsFromBlockWebhook(fixtures.BTC_Confirmation_Test.blockcpher_webhook_payload)        
        payment = await models.Payment.findOne({
            where: {
                invoice_uid: invoice.uid
            }
        })

        invoice = await models.Invoice.findOne({
            where: {
                uid: invoice.uid
            }
        })

        expect(payment.get('status')).to.be.equal('confirmed')

        expect(invoice.status).to.be.equal('paid')

    })

})
