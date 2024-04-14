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

require('dotenv').config()

import { confirmTransactionsFromBlockWebhook } from '../../lib/blockcypher'

import { expect, generateAccount, newInvoice } from '../utils'

import * as fixtures from '../fixtures'
import { recordPayment } from '../../lib/payments'

import { setAddress } from '../../lib/core'
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
                invoice_uid: invoice.uid
            }
        })    

        invoice = await prisma.invoices.findFirstOrThrow({
            where: {
                uid: invoice.uid
            }
        })

        expect(payment.status).to.be.equal('confirmed')

        expect(invoice.status).to.be.equal('paid')

    })

})
