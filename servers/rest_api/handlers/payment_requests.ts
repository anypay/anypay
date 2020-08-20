
import { log } from '../../../lib';

import * as Boom from 'boom';

import { show as handleBIP70 } from './bip70_payment_requests'
import { show as handleJsonV2 } from './json_payment_requests'
import { show as handleBIP270 } from './bip270_payment_requests'

export async function create(req, h) {

  try {

    log.info('pay.request.create', { uid: req.params.uid, headers: req.headers })

  } catch(error) {

    return Boom.badRequest(error.message);

  }

}

export async function show(req, h) {

  log.info('pay.request.show', { uid: req.params.uid, headers: req.headers })

  try {

    let isBIP70 = /paymentrequest$/
    let isJsonV2 = /application\/payment-request$/

    if (req.headers['accept'].match(isBIP70)) {

      return handleBIP70(req, h)

    } else if (req.headers['accept'].match(isJsonV2)) {

      return handleJsonV2(req, h)

    } else {

      return handleBIP270(req, h)

    }

  } catch(error) {

    log.error('pay.request.error', { error });

    return Boom.badRequest(error.message);

  }

}

