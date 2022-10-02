
import { findOrCreateWalletBot } from "../.."

import { ensureInvoice, Invoice } from "../../../../lib/invoices"

import { findAll } from "../../../../lib/orm"

import { unauthorized } from '@hapi/boom'

export async function index (req, h) {

    const { app } = await findOrCreateWalletBot(req.account)

    let { status, limit, offset, currency } = req.query

    if (!limit) { limit = 100 }

    const where = {
        app_id: app.id,
        status: status || 'unpaid'
    }

    if (currency) {

    where['currency'] = currency

    }

    const query = { where }

    if (limit) {
        query['limit'] = limit || 100
    }

    if (offset) {
        query['offset'] = offset
    }

    const invoices = await findAll<Invoice>(Invoice, query)

    return {
        app: '@wallet-bot',
        invoices: invoices.map(invoice => invoice.toJSON())
    }

  }

  export async function cancel(req, h) {

    try {


    const { app, walletBot } = await findOrCreateWalletBot(req.account)

    const invoice = await ensureInvoice(req.params.invoice_uid)

    if (invoice.get('app_id') !== app.get('id')) {

        console.log('INVOICE APP ID', invoice.get('app_id'))

        console.log('APP ID', app.id)

        return unauthorized()

    }

    const cancelled = await walletBot.cancelInvoice(invoice)

    return {

        invoice: cancelled.toJSON()
    }


    } catch(error) {

        console.error(error)
        console.error('_ERROR CANCEL', error.message)

        return h.badRequest(error)
    }


  }