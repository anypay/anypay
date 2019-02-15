
import { models } from '../../../../lib';

export async function update(req, h) {

  let account = await models.Account.findOne({ where: {

    id: req.params.id

  }});

  if (!account) {

    return {

      success: false,

      error: 'account not found'

    }

  }

  await models.Account.update(req.payload, {

    where: { id: req.params.id }

  });

  account = await models.Account.findOne({ where: {

    id: req.params.id

  }});

  return {

    success: true,

    account

  }

}

