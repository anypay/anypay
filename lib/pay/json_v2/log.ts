
const pino = require('pino')()

const _log = pino.child({ protocol: 'jsonV2' })

import { recordEvent, Event } from '../../events'

export async function info(event: string, payload: any) {

  _log.info(payload, event)

  await recordEvent(payload, event)

}

export async function error(event: string, payload: any) {

  _log.info(payload, event)

  await recordEvent(payload, event)

}

export const log = { info, error }

