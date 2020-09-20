
import { elasticsearch } from '../../../lib/elasticsearch'

export async function accounts(req, h) {

  let query = req.query.query

  let result = await elasticsearch.search({
    index: 'accounts',
    type: 'account',
    body: {
      query: {
        match: { business_name: `.+${query}.+` }
      }
    }
  })

  return { result }

}
