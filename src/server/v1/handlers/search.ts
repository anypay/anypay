
import { search } from '@/lib/search'

import { log } from '@/lib/log'
import AuthenticatedRequest from '@/server/auth/AuthenticatedRequest'
import { Request, ResponseToolkit } from '@hapi/hapi'

export async function create(request: AuthenticatedRequest | Request, h: ResponseToolkit) {
  
  try {

    const { search: query } = request.payload as {
      search: string
    }

    let result = await search(query, (request as AuthenticatedRequest).account)

    return h.response({ result })

  } catch(error: any) {

    log.error('search.error', error)

    return h.response({ error }).code(500)

  }

}

