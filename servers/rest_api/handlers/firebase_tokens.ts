
import { models } from '../../../lib';

export async function show(req, h) {

  let firebase_token = await models.FirebaseToken.findOne({
    where: {
      account_id: req.account.id
    }
  });

  return { firebase_token }

}

export async function update(req, h) {

  let [firebase_token, isNew] = await models.FirebaseToken.findOrCreate({

    where: {
      account_id: req.account.id
    },

    defaults: {

      account_id: req.account.id,

      token: req.payload.firebase_token

    }
  })

  if (!isNew) {

    firebase_token.token = req.payload.firebase_token; 

    await firebase_token.save();

  }

  return { firebase_token }

}

