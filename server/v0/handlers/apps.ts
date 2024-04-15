
import { ResponseToolkit } from '@hapi/hapi'
import { apps } from '../../../lib'
import AuthenticatedRequest from '../../auth/AuthenticatedRequest'
import { notFound } from '@hapi/boom'
import prisma from '../../../lib/prisma'

export async function index(request: AuthenticatedRequest, h: ResponseToolkit) {

  const apps = await prisma.apps.findMany({
    where: {
      account_id: request.account.id
    }
  })

  return  { apps }

}

export async function show(request: AuthenticatedRequest, h: ResponseToolkit) {

  const app = await prisma.apps.findFirst({
    where: {
      account_id: request.account.id,
      id: Number(request.params.id)
    }
  })

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
