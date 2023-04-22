
import { log } from "../../../lib"

import { publish } from 'rabbi'

import { confirmTransactionsFromBlockWebhook } from "../../../lib/blockcypher"

export async function create(req, h) {

    const webhook = req.payload

    try {

        log.info('blockcypher.webhook.received', webhook)

        publish('anypay', 'blockcypher.webhook.received', webhook)

        confirmTransactionsFromBlockWebhook(webhook)

        return { success: true }

    } catch (err) {

        return { success: false }

    }

}
