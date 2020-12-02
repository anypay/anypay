import {woocommerce}  from '../../../lib';

import * as Boom from 'boom'

export async function index(req, h) {

  try {

    let settings = await woocommerce.getSettings(req.params.account_id)

    return { settings }

  } catch(error) {

    return Boom.badRequest(error.message)

  }

}

