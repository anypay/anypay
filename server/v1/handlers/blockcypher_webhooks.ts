
import { log } from "../../../lib"

import { publish } from 'rabbi'

export async function create(req, h) {

    const webhook = req.payload

    try {

        log.info('blockcypher.webhook.received', webhook)

        publish('anypay', 'blockcypher.webhook.received', webhook)

        return { success: true }

    } catch (err) {

        console.log('blockcypher.webhook.received.error', err)

        return { success: false }

    }

}
