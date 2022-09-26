
import { models } from '../../../lib';

export async function create(req, h) {

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

export async function update(req, h) {

  return create(req, h)

}

