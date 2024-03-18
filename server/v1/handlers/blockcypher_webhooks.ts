
import { log } from "../../../lib"

import { publish } from '../../../lib/amqp'

import { confirmTransactionsFromBlockWebhook } from "../../../lib/blockcypher"

export async function create(req, h) {

    const webhook = req.payload

    try {

        log.info('blockcypher.webhook.received', webhook)

        publish('blockcypher.webhook.received', webhook)

        confirmTransactionsFromBlockWebhook(webhook)

        return { success: true }

    } catch (err) {

        return { success: false }

    }

}
