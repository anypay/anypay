
import { models, apps } from '../../../lib'

export async function index(req, h) {

  let apps = await models.App.findAll({ where: {
  
    account_id: req.account.id

  }})

  return  { apps }

}

export async function show(req, h) {

  let app = await models.App.findOne({ where: {
  
    account_id: req.account.id,

    id: req.params.id

  }})

  if (!app) {

    return req.boom.notFound(`app ${req.params.id} not found`)
  }

  return  { app }

}

export async function create(req, h) {

  let app = await apps.createApp({
    account_id: req.account.id,
    name: req.payload.name
  })
  
  return  { app }

}
