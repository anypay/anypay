
import { search, SearchResult } from '../../../lib/search'

export async function show(req, h) {

  let query = req.query.query || req.payload.query

  let result: SearchResult[] = await search(query)

  return {

    query,
  
    result
  }

}
