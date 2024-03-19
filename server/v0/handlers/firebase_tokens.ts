
import { ResponseToolkit } from '@hapi/hapi';
import { models } from '../../../lib';
import AuthenticatedRequest from '../../auth/AuthenticatedRequest';

export async function show(request: AuthenticatedRequest, h: ResponseToolkit) {

  let firebase_token = await models.FirebaseToken.findOne({
    where: {
      account_id: request.account.id
    }
  });

  return { firebase_token }

}

export async function index(request: AuthenticatedRequest, h: ResponseToolkit) {

  let firebase_tokens = await models.FirebaseToken.findAll({
    where: {
      account_id: request.account.id
    }
  });

  return firebase_tokens

}

export async function create(request: AuthenticatedRequest, h: ResponseToolkit) {

  const { firebase_token: token } = request.payload as { firebase_token: string }

  let [firebase_token] = await models.FirebaseToken.findOrCreate({

    where: {
      account_id: request.account.id,

      token
    },

    defaults: {

      account_id: request.account.id,

      token

    }
  })

  return { firebase_token }

}

export async function update(request: AuthenticatedRequest, h: ResponseToolkit) {

  return create(request, h)

}

