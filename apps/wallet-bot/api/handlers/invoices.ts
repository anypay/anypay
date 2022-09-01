
import { app } from 'anypay'
import axios from 'axios'

import * as Joi from 'joi'

import { log } from '../../../../lib/log'

import { badRequest } from 'boom'

import { createPaymentRequest } from '../../../../lib/payment_requests'

export async function create(req, h) {

    try {

        const anypay = app(req.token)

        const template = [{
            currency: req.payload.currency,
            to: [{
                address: req.payload.to.address,
                amount: req.payload.to.amount,
                currency: req.payload.to.currency
            }]
        }]

        const options = req.payload.options

        console.log({ app_id: req.app_id, template, options })

        let result = await createPaymentRequest(
            req.app_id,
            template,
            options
        )

        return h.response(result).code(201)

    } catch(error) {

        log.error('apps.wallet-bot.api.handlers.invoices.create.error', error)

        return badRequest(error)

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
