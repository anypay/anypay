const log = require("winston");
const http = require("superagent");

import axios from 'axios'

const channels = {
  'invoice-bot': 'https://hooks.slack.com/services/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',
  'events': 'https://hooks.slack.com/services/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'
}

export function notify(message: string, channel: string = 'invoice-bot') {

  log.info(`notify slack ${message}`);

  

  if (process.env.NODE_ENV === 'production') {

    const result = await axios.post(channels[channel] as string, {
      text: message
    })

  }
}

