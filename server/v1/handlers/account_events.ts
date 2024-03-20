
import AuthenticatedRequest from '../../auth/AuthenticatedRequest'
import { listAccountEvents } from '../../../lib/events'
import { ResponseToolkit } from '@hapi/hapi'

export async function index(request: AuthenticatedRequest, h: ResponseToolkit) {

  let events = await listAccountEvents(request.account, {

    order: request.query.order

  })

  return h.response({

    account_id: request.account.id,

    events

  })

}

