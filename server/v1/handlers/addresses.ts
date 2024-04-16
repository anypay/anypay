
import AuthenticatedRequest from '../../auth/AuthenticatedRequest'
import { setAddress, listAddresses, removeAddress } from '../../../lib/addresses'

import { log } from '../../../lib/log'
import { ResponseToolkit } from '@hapi/hapi'

export async function update(request: AuthenticatedRequest, h: ResponseToolkit) {

  const body = request.payload as {
    chain?: string,
    currency: string,
    value: string
  }

  console.log("--PAYLOAD--", body)

  if (!body.chain) { body.chain = body.currency }

  log.debug('server.v1.handlers.addresses.update', body)

  let address = await setAddress(request.account, body as {
    chain: string,
    currency: string,
    value: string
  })

  return h.response({ address }).code(200)

}

export async function index(request: AuthenticatedRequest, h: ResponseToolkit) {

  let addresses = await listAddresses(request.account)

  return h.response({ addresses }).code(200)

}

export async function remove(request: AuthenticatedRequest, h: ResponseToolkit) {

  try {

    let [currency, chain] = request.params.code.split('_')

    if (!chain) { chain = currency }

    await removeAddress({
      account: request.account,
      chain,
      currency
    })

    return h.response({ success: true }).code(200)

  } catch(error: any) {

    log.error('server.addresses.remove.error', error)

    return h.response({ error: error.message }).code(500)

  }

}
