
import { badRequest, notFound } from 'boom'

import { models, apps } from '../../../lib'

export async function index(req, h) {

  try {

    let apps = await models.App.findAll({ where: {
    
      account_id: req.account.id

    }})

    return  { apps }

  } catch(error) {

    return badRequest(error)

  }

}

export async function show(req, h) {

  try {

    let app = await models.App.findOne({ where: {
    
      account_id: req.account.id,

      id: req.params.id

    }})

    if (!app) {

      return notFound(`app ${req.params.id} not found`)
    }

    return  { app }

  } catch(error) {

    return badRequest(error)

  }

}

export async function create(req, h) {

  try {

    let app = await apps.createApp({
      account_id: req.account.id,
      name: req.payload.name
    })
    
    return  { app }

  } catch(error) {

    return badRequest(error)

  }

}
