
import AuthenticatedRequest from '@/server/auth/AuthenticatedRequest'
import { listAccountEvents } from '@/lib/events'
import { Request, ResponseToolkit } from '@hapi/hapi'

export async function index(request: AuthenticatedRequest | Request, h: ResponseToolkit) {

  let events = await listAccountEvents((request as AuthenticatedRequest).account, {

    order: request.query.order

  })

  return h.response({

    account_id: (request as AuthenticatedRequest).account.id,

    events

  })

}

