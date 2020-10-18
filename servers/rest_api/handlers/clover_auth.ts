
import * as Boom from 'boom'

import { models } from '../../../lib'

export async function show(req, h) {

  let auth = await models.CloverAuth.findOne({
    where: { account_id: req.account.id },
    order: [['createdAt', 'desc']]
  }) 

  if (auth) {

    return {
      authenticated: true,
      auth
    }

  } else {

    return {
      authenticated: false
    }

  }

}

export async function create(req, h) {
  console.log('clover.auth.create', req.payload)

  let auth = await models.CloverAuth.create({
    merchant_id: req.payload.merchant_id,
    access_token: req.payload.access_token,
    employee_id: req.payload.employee_id,
    client_id: req.payload.client_id,
    account_id: req.account.id
  })

  return { auth }

}

