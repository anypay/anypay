
import prisma from '@/lib/prisma'
import AuthenticatedRequest from '@/server/auth/AuthenticatedRequest'
import { Request } from '@hapi/hapi'

export async function create(request: Request | AuthenticatedRequest) { 

  const payload = request.payload as {
    api_key: string
    api_secret: string
  }

  let krakenAccount = await prisma.krakenAccounts.findFirst({
    where: {
      account_id: (request as AuthenticatedRequest).account.id
    }
  })

  if (!krakenAccount) {
    krakenAccount = await prisma.krakenAccounts.create({
      data: {
        api_key: payload.api_key,
        api_secret: payload.api_secret,
        account_id: (request as AuthenticatedRequest).account.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
  }

  await prisma.krakenAccounts.update({
    where: {
      id: krakenAccount.id
    },
    data: {
      api_key: payload.api_key,
      api_secret: payload.api_secret,
      updatedAt: new Date()
    }
  })

  return {
    api_key: krakenAccount.api_key,
    api_secret: 'xxxxxxxxxxxxxx'
  }

}

export async function show(request: Request | AuthenticatedRequest) { 

  let krakenAccount = await prisma.krakenAccounts.findFirst({
    where: {
      account_id: (request as AuthenticatedRequest).account.id
    }
  })

  if (!krakenAccount) {

    return {
      api_key: null,
      api_secret: null
    }

  } else {

    return {
      api_key: krakenAccount.api_key,
      api_secret: 'xxxxxxxxxxxxxx'
    }
  }

}

export async function destroy(request: Request | AuthenticatedRequest) { 

  let krakenAccount = await prisma.krakenAccounts.findFirst({
    where: {
        account_id: (request as AuthenticatedRequest).account.id
    }
  })

  if (krakenAccount) {
    await prisma.krakenAccounts.delete({
      where: {
        id: krakenAccount.id
      }
    })
  }

  return { success: true }

}

