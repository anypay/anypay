
import { channel, log } from 'rabbi'

import { loadFromFiles } from '../config'

export const exchange = 'rabbi'

export const queue = 'reload_config'

export const routingkey = 'reload_config'

export default async function start(channel, msg, json) {

  log.info('rabbi.actor.reload_config', {
    message: msg.content.toString(),
    json
  })

  loadFromFiles()
  
  channel.ack(msg)
}

