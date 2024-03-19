
import { ResponseToolkit } from '@hapi/hapi'
import { models, apps } from '../../../lib'
import AuthenticatedRequest from '../../auth/AuthenticatedRequest'
import { notFound } from '@hapi/boom'

export async function index(request: AuthenticatedRequest, h: ResponseToolkit) {

  let apps = await models.App.findAll({ where: {
  
    account_id: request.account.id

  }})

  return  { apps }

}

export async function show(request: AuthenticatedRequest, h: ResponseToolkit) {

  let app = await models.App.findOne({ where: {
  
    account_id: request.account.id,

    id: request.params.id

  }})

  if (!app) {

    return notFound(`app ${request.params.id} not found`)
  }

  return  { app }

}

export async function create(request: AuthenticatedRequest, h: ResponseToolkit) {

  const { name } = request.payload as {
    name: string
  }

  let app = await apps.createApp({
    account_id: request.account.id,
    name
  })
  
  return  { app }

}
