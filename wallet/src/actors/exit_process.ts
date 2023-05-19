
import { channel, log } from 'rabbi'

import { loadFromFiles } from '../config'

export default async function(channel, msg, json) {

  log.info('rabbi.actor.exit_process', {
    message: msg.content.toString(),
    json
  })

  channel.ack(msg)

  setTimeout(() => {

    process.exit()

  }, 2000)
  
}

