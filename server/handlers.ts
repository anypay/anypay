
import { requireHandlersDirectory } from '../lib/rabbi_hapi';

import { join } from 'path';

const v0 = requireHandlersDirectory(join(__dirname, './v0/handlers'));

const v1 = requireHandlersDirectory(join(__dirname, './v1/handlers'))

import { log } from '../lib/log'

export { v0, v1 }

export function failAction(request, h, error) {

  log.error('api.failAction', error)

  return error
}

