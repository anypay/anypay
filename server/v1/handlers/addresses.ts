
import { setAddress } from '../../../lib/addresses'

export async function update(req, h) {

  req.logger.info('server.v1.handlers.addresses.update', req.payload)

  let address = await setAddress(req.account, req.payload)

  return h.response({ address: address.toJSON() }).code(200)

}

