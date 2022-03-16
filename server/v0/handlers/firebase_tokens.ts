
import { models, utils } from '../../../lib';

export async function show(req, h) {

  let firebase_token = await models.FirebaseToken.findOne({
    where: {
      account_id: req.account.id
    }
  });

  return { firebase_token }

}

export async function index(req, h) {

  let firebase_tokens = await models.FirebaseToken.findAll({
    where: {
      account_id: req.account.id
    }
  });

  return firebase_tokens

}

export async function create(req, h) {

  let [firebase_token, isNew] = await models.FirebaseToken.findOrCreate({

    where: {
      account_id: req.account.id,

      token: req.payload.firebase_token
    },

    defaults: {

      account_id: req.account.id,

      token: req.payload.firebase_token

    }
  })

  return { firebase_token: firebase_token.toJSON() }

}

export async function update(req, h) {

  return create(req, h)

}

