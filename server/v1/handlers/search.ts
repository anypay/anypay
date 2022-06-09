
import { search } from '../../../lib/search'

import { log } from '../../../lib/log'

export async function create(req, h) {
  
  try {

    let result = await search(req.payload.search, req.account)

    result = result.map(item => {

      item.value = item.value.toJSON()

      return item

    })

    return h.response({ result })

  } catch(error) {

    log.error('search.error', error)

    return h.response({ error }).code(500)

  }

}

