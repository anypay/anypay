
import { badRequest, notFound } from 'boom'

import { models, apps } from '../../../lib'

export async function index(req, h) {

  let apps = await models.App.findAll({ where: {
  
    account_id: req.account.id

  }})

  return  { apps }

}

export async function show(request, h) {

  let app = await models.App.findOne({ where: {
  
    account_id: request.account.id,

    id: request.params.id

  }})

  if (!app) {

    throw notFound(`app ${request.params.id} not found`)
  }

  return  { app }

}

export async function create(request, h) {

  let app = await apps.createApp({
    account_id: request.account.id,
    name: request.payload.name
  })
  
  return  { app }

}

