
import * as winston from 'winston';

const log = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.Console()
  ]
});

export {

  log

}

const logger = require('riverpig')('anypay')
const { IncomingWebhook } = require('@slack/webhook')

import { models } from '../models'

const slackWebhook = new IncomingWebhook('https://hooks.slack.com/services/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')
const slackErrorWebhook = new IncomingWebhook('https://hooks.slack.com/services/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')

export function logError(event, error) {

  logger.error(event, error.message)
  notifySlackError(event, error.message)
  //logToPostgres(event, error, 'error')
  publishAmqp(event, error)

}

export function logInfo(event, payload: object = {}) {

  logger.info(event, JSON.stringify(payload))
  notifySlack(event, JSON.stringify(payload))
  //logToPostgres(event, payload, 'info')
  publishAmqp(event, payload)

}
function notifySlackError(event, payload) {
  return slackErrorWebhook.send({
    text: `${event} ${payload}`
  })
}

function notifySlack(event, payload) {
  return slackWebhook.send({
    text: `${event} ${JSON.stringify(payload)}`
  })
}

function publishAmqp(event, payload) {

}

  /*
function logToPostgres(event, payload, level) {

  models.LogEvent.create({ event, payload, level })
}
   */

process.on('unhandledRejection', error => {

  logError('unhandledRejection', error)

})
