
import { cancelInvoice, findOrCreateWalletBot } from "../.."

import { ensureInvoice } from "../../../../lib/invoices"

import { unauthorized } from '@hapi/boom'
import prisma from "../../../../lib/prisma"
import { ResponseToolkit } from "@hapi/hapi"
import boom = require("boom")

export async function index (req: any) {

    const { app } = await findOrCreateWalletBot(req.account)

    let { status, limit, offset, currency } = req.query

    if (!limit) { limit = 100 }

    const where: any = {
        app_id: app.id,
        status: status || 'unpaid'
    }

    if (currency) {

    where['currency'] = currency

    }

    const query: any = { where }

    if (limit) {
        query['limit'] = limit || 100
    }

    if (offset) {
        query['offset'] = offset
    }

    const invoices = await prisma.invoices.findMany({
        where: query.where,
        take: query.limit,
        skip: query.offset,
    })


    return {
        app: '@wallet-bot',
        invoices
    }

  }

  export async function cancel(req: any, h: ResponseToolkit) {

    try {


    const { app, walletBot } = await findOrCreateWalletBot(req.account)

    const invoice = await ensureInvoice(req.params.invoice_uid)

    if (invoice.app_id !== app.id) {

        return unauthorized()

    }

    const cancelled = await cancelInvoice(walletBot, invoice.uid)

    return {

        invoice: cancelled
    }


    } catch(error: any) {

        console.error(error)

        return boom.badRequest(error)
    }


  }