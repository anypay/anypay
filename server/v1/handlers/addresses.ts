
import { setAddress, listAddresses, removeAddress } from '../../../lib/addresses'

import { log } from '../../../lib/log'

export async function update(req, h) {

  log.debug('server.v1.handlers.addresses.update', req.payload)

  let address = await setAddress(req.account, req.payload)

  return h.response({ address: address.toJSON() }).code(200)

}

export async function index(req, h) {

  let addresses = await listAddresses(req.account)

  return h.response({ addresses }).code(200)

}

export async function remove(req, h) {

  try {

    await removeAddress(req.account, req.params.currency)

    return h.response({ success: true }).code(200)

  } catch(error) {

    log.error('server.addresses.remove.error', error)

    return h.response({ error: error.message }).code(500)

  }

}
