
import { setAddress, listAddresses } from '../../../lib/addresses'

export async function update(req, h) {

  req.logger.info('server.v1.handlers.addresses.update', req.payload)

  let address = await setAddress(req.account, req.payload)

  return h.response({ address: address.toJSON() }).code(200)

}

export async function index(req, h) {

  let addresses = await listAddresses(req.account)

  return h.response({ addresses }).code(200)

}

