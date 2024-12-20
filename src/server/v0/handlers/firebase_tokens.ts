
import { ResponseToolkit } from '@hapi/hapi';
import AuthenticatedRequest from '@/server/auth/AuthenticatedRequest';
import prisma from '@/lib/prisma';

export async function show(request: AuthenticatedRequest, h: ResponseToolkit) {

  const firebase_token = await prisma.firebase_tokens.findFirst({
    where: {
      account_id: request.account.id
    },
    orderBy: {
      id: 'asc'
    }
  })

  return { firebase_token }

}

export async function index(request: AuthenticatedRequest, h: ResponseToolkit) {

  const firebase_tokens = await prisma.firebase_tokens.findMany({
    where: {
      account_id: request.account.id
    }
  })

  return firebase_tokens

}

export async function create(request: AuthenticatedRequest, h: ResponseToolkit) {

  const { firebase_token: token } = request.payload as { firebase_token: string }

  let firebase_token = await prisma.firebase_tokens.findFirst({
    where: {
      account_id: request.account.id,
    },
    orderBy: {
      id: 'asc'
    }
  })

  if (!firebase_token) {

    firebase_token = await prisma.firebase_tokens.create({
      data: {
        account_id: request.account.id,
        token,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
  }

  if (firebase_token.token !== token) {

    firebase_token = await prisma.firebase_tokens.update({
      where: {
        id: firebase_token.id
      },
      data: {
        token,
        updatedAt: new Date()
      }
    })
  }

  return { firebase_token }

}

export async function update(request: AuthenticatedRequest, h: ResponseToolkit) {

  return create(request, h)

}

