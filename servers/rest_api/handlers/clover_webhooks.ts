
import * as Boom from 'boom'

import { amqp, log, models } from '../../../lib'

export async function create(req, h) {

  try {
    log.info('clover.webhook', req.payload)

    await amqp.publish('clover.webhook', req.payload)

    let record = await models.CloverWebhook.create({ payload: req.payload })

    return { success: true }

  } catch(error) {

    log.error('error publishing clover webhook', error)

    return Boom.badRequest(error)

  }

}
