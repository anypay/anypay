
import { search } from '@/lib/search'

import { log } from '@/lib/log'
import AuthenticatedRequest from '@/server/auth/AuthenticatedRequest'
import { ResponseToolkit } from '@hapi/hapi'
import { Request } from '@hapi/hapi';
export async function create(request: AuthenticatedRequest | Request, h: ResponseToolkit) {

  const { search: query } = request.payload as { search: string }
  
  try {

    let result = await search(query, (request as AuthenticatedRequest).account)

    result = result.map(item => {

      item.value = item.value

      return item

    })

    return h.response({ result })

  } catch(error: any) {

    log.error('search.error', error)

    return h.response({ error }).code(500)

  }

}

