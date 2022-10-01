
import { ensureInvoice } from "../../../lib/invoices"
import { expect, walletBot } from "../../utils"

describe("Wallet Bot Library", () => {

    const address = 'XxarAzZrvZdZfqWPwCqJCK3Fyd2PMg38wy'

    describe("Creating Payment Requests", () => {

        it('#createPaymentRequest should create an invoice with the currency', async () => {

            const { invoice_uid } = await walletBot.createInvoice({
                template: {

                    currency: 'DASH',

                    to: {
                        currency: 'USD',
                        amount: 52.00,
                        address
                    }
                }
            })

            const invoice = await ensureInvoice(invoice_uid)

            expect(invoice.get('currency')).to.be.equal('DASH')
        })

        it('#createPaymentRequest should add webhook_url to the underlying invoice', async () => {

            const webhook_url = 'https://webhooks.lol/anypay'

            const { invoice_uid } = await walletBot.createInvoice({

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

            const invoice = await ensureInvoice(invoice_uid)

            expect(invoice.get('webhook_url')).to.be.equal(webhook_url)

        })

    })

    describe("Querying Invoices and Payments", () => {

        it("#listUnpaid should return all unpaid invoices", async () => {

            const [invoice] = await walletBot.listInvoices()

            expect(invoice.status).to.be.equal('unpaid')

        })

        it("#listUnpaid should return only invoices of specified currency", async () => {

            const [invoice] = await walletBot.listInvoices({ currency: 'BSV' })

            expect(invoice.status).to.be.equal('unpaid')

            expect(invoice.currency).to.be.equal('BSV')

        })

        it("#getInvoice should return the details of an invoice", async () => {

            const { invoice_uid } = await walletBot.createInvoice({
                
                template: {

                    currency: 'DASH',

                    to: {
                        currency: 'USD',
                        amount: 52.00,
                        address
                    }
                }
            })

            const invoice = await walletBot.getInvoice(invoice_uid)

            expect(invoice.currency).to.be.equal('DASH')

        })

        it.skip("#cancelInvoice should cancel an invoice", async () => {

            const [invoice] = await walletBot.listInvoices()

            await walletBot.cancelInvoice(invoice.uid)

            let cancelled = await walletBot.getInvoice(invoice.uid)

            expect(cancelled.status).to.be.equal('cancelled')

        })

        it("#listInvoices should list all invoices by status", async () => {

            const invoices = await walletBot.listInvoices()

            expect(invoices).to.be.an('array')

        })
        
    })

})
