
import * as Joi from 'joi'

import { log } from '../../../../lib/log'

import { badRequest } from 'boom'

import { findOrCreateWalletBot } from '../..'

import { findAll } from '../../../../lib/orm'

import { Invoice } from '../../../../lib/invoices'

export async function create(req, h) {

    try {

        const {walletBot} = await findOrCreateWalletBot(req.app)

        const template = [{
            currency: req.payload.currency,
            to: [{
                address: req.payload.to.address,
                amount: req.payload.to.amount,
                currency: req.payload.to.currency
            }]
        }]

        const options = req.payload.options

        let result = await walletBot.createPaymentRequest({
            template,
            options
        })

        return h.response(result.toJSON()).code(201)

    } catch(error) {

        log.error('apps.wallet-bot.api.handlers.invoices.create.error', error)

        return badRequest(error)

    }

}

export async function index(req, h) {

    const { app } = await findOrCreateWalletBot(req.app)

    let { limit, offset, currency } = req.query

    if (!limit) { limit = 100 }

    const where = {
        app_id: app.id,
        status: 'unpaid'
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

    log.info('wallet-bot.invoices.list', query)

    const invoices = await findAll<Invoice>(Invoice, query)

    log.info('wallet-bot.invoices.list.response')

    return {
        app: '@wallet-bot',
        invoices: invoices.map(invoice => invoice.toJSON())
    }

}

export const schema = {

    payload: Joi.object({

        currency: Joi.string().required(),

        to: Joi.object({
            address: Joi.string().required(),
            amount: Joi.number().required(),
            currency: Joi.string().required()
        }).required(),

        options: Joi.object({
            webhook_url: Joi.string().optional(),
            memo: Joi.string().optional()
        }).optional()
    }),

    response: Joi.any()
}
