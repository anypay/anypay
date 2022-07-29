
import { models } from '../../../lib';

export async function show(req) {

  let firebase_token = await models.FirebaseToken.findOne({
    where: {
      account_id: req.account.id
    }
  });

  return { firebase_token }

}

export async function index(req) {

  let firebase_tokens = await models.FirebaseToken.findAll({
    where: {
      account_id: req.account.id
    }
  });

  return firebase_tokens

}

export async function create(req) {

  let [firebase_token] = await models.FirebaseToken.findOrCreate({

    where: {
      account_id: req.account.id,

      token: req.payload.firebase_token
    },

    defaults: {

      account_id: req.account.id,

      token: req.payload.firebase_token

    }
  })

  return { firebase_token }

}

export async function update(req) {

  return create(req)

}

