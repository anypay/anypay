
import { search } from '../../../lib/search'

export async function create(req, h) {

    let result = await search(req.payload.search, req.account)

    result = result.map(item => {

      item.value = item.value.toJSON()

      return item

    })

    return h.response({ result })

}
