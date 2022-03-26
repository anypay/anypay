
import { log } from '../../../lib/log';

import { listAccountEvents } from '../../../lib/events'

export async function index(request, h) {

  let events = await listAccountEvents(request.account, {

    order: request.query.order

  })

  return h.response({

    account_id: request.account.id,

    events: events.map(event => event.toJSON())

  })

}

