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

import { cancelInvoice, createInvoice, getInvoice, listInvoices } from "@/apps/wallet-bot"
import { ensureInvoice } from "@/lib/invoices"
import { expect, walletBot } from "@/test/utils"

describe("Wallet Bot Library", () => {

    const address = 'XxarAzZrvZdZfqWPwCqJCK3Fyd2PMg38wy'

    describe("Creating Payment Requests", () => {

        it('#createPaymentRequest should create an invoice with the currency', async () => {

            const { invoice_uid } = await createInvoice(walletBot, {
                template: {

                    currency: 'DASH',

                    to: {
                        currency: 'USD',
                        amount: 52.00,
                        address
                    }
                }
            })

            const invoice = await ensureInvoice(String(invoice_uid))

            expect(invoice.currency).to.be.equal('DASH')
        })

        it('#createPaymentRequest should add webhook_url to the underlying invoice', async () => {

            const webhook_url = 'https://webhooks.lol/anypay'

            const { invoice_uid } = await createInvoice(walletBot, {

                template: {

                    currency: 'DASH',

                    to: {
                        currency: 'USD',
                        amount: 52.00,
                        address
                    }
                },
                options: {

                    webhook_url
                }
            })

            const invoice = await ensureInvoice(String(invoice_uid))

            expect(invoice.webhook_url).to.be.equal(webhook_url)

        })

    })

    describe("Querying Invoices and Payments", () => {

        it("#listUnpaid should return all unpaid invoices", async () => {

            const [invoice] = await listInvoices(walletBot)

            expect(invoice.status).to.be.equal('unpaid')

        })

        it("#listUnpaid should return only invoices of specified currency", async () => {

            const [invoice] = await listInvoices(walletBot, { currency: 'BSV' })

            expect(invoice.status).to.be.equal('unpaid')

            expect(invoice.currency).to.be.equal('BSV')

        })

        it("#getInvoice should return the details of an invoice", async () => {

            const { invoice_uid } = await createInvoice(walletBot, {
                
                template: {

                    currency: 'DASH',

                    to: {
                        currency: 'USD',
                        amount: 52.00,
                        address
                    }
                }
            })

            const invoice = await getInvoice(walletBot, String(invoice_uid))

            expect(invoice.currency).to.be.equal('DASH')

        })

        it.skip("#cancelInvoice should cancel an invoice", async () => {

            const [invoice] = await listInvoices(walletBot)

            await cancelInvoice(walletBot, invoice.uid)

            let cancelled = await getInvoice(walletBot, invoice.uid)

            expect(cancelled.status).to.be.equal('cancelled')

        })

        it("#listInvoices should list all invoices by status", async () => {

            const invoices = await listInvoices(walletBot)

            expect(invoices).to.be.an('array')

        })
        
    })

})
