
import { search } from '../../../lib/search'

import { log } from '../../../lib/log'
import AuthenticatedRequest from '../../auth/AuthenticatedRequest'
import { ResponseToolkit } from '@hapi/hapi'

export async function create(request: AuthenticatedRequest, h: ResponseToolkit) {
  
  try {

    const { search: query } = request.payload as {
      search: string
    }

    let result = await search(query, request.account)

    return h.response({ result })

  } catch(error: any) {

    log.error('search.error', error)

    return h.response({ error }).code(500)

  }

}

