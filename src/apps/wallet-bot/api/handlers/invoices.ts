
import * as Joi from 'joi'

import { log } from '../../../../lib/log'

import { badRequest } from 'boom'

import { createPaymentRequest, findOrCreateWalletBot } from '../..'

import {  ResponseToolkit } from '@hapi/hapi'
import prisma from '../../../../lib/prisma'

export async function create(req: any, h: ResponseToolkit) {

    try {

        const payload = req.payload as {
            to: {
                address: string,
                amount: number,
                currency: string
            },
            currency: string,
            options: any
        };

        const {walletBot} = await findOrCreateWalletBot(req.account)

        const template = [{
            currency: payload.currency,
            to: [{
                address: payload.to.address,
                amount: payload.to.amount,
                currency: payload.to.currency
            }]
        }]

        const options = payload.options

        let result = await createPaymentRequest(walletBot, {
            template,
            options
        })

        return h.response(JSON.parse(JSON.stringify(result))).code(201)

    } catch(error: any) {

        log.error('apps.wallet-bot.api.handlers.invoices.create.error', error)

        return badRequest(error)

    }

}

export async function index(req: any) {

    const { app } = await findOrCreateWalletBot(req.account)

    let { limit, offset, currency } = req.query

    if (!limit) { limit = 100 }

    const status = req.query.status || 'unpaid'

    const where: any = {
        app_id: app.id,
        status
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

    query['order'] = [['createdAt', 'desc']]

    log.info('wallet-bot.invoices.list', query)

    const invoices = await prisma.invoices.findMany({
        where: query.where,
        take: query.limit,
        skip: query.offset,
    })

    log.info('wallet-bot.invoices.list.response')

    return {
        app: '@wallet-bot',
        invoices
    }

}

export const schema = {

    payload: Joi.object({

        currency: Joi.string().required(),

        to: Joi.object({
            address: Joi.string().required(),
            amount: Joi.number().required(),
            currency: Joi.string().required()
        }).required().label('WalletBotCreatePaymentRequestTo'),

        options: Joi.object({
            webhook_url: Joi.string().optional(),
            memo: Joi.string().optional()
        }).optional().label('WalletBotCreatePaymentRequestOptions')
    }).label('WalletBotCreatePaymentRequestParams'),

    response: Joi.any().label('WalletBotCreatePaymentRequestResponse')
}
