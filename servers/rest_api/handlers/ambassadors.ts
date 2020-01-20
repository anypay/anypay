import * as Hapi from 'hapi';

import { Request, ResponseToolkit } from 'hapi';

import { models, ambassadors } from '../../../lib';

module.exports.list_account_claims = async function(req: Hapi.Request, h: Hapi.ResponseToolkit) {

  let accountId = req.auth.credentials['accessToken']['account_id'];

  let account = await models.Account.findOne({ where: { id: accountId }});

  return ambassadors.listAccountClaims(account.email);

};

module.exports.claim_merchant = async function(req: Hapi.Request, h: Hapi.ResponseToolkit) {

  let accountId = req.auth.credentials['accessToken']['account_id'];

  let account = await models.Account.findOne({ where: { id: accountId }});

  return ambassadors.claimBusiness(

    account.email,

    req.payload['merchantEmail']
    
  );

};

module.exports.list = async function(req: Request, h: ResponseToolkit) {

  let ambassadors = await models.Ambassador.findAll();

  return { ambassadors };

};

export async function index(req, h: ResponseToolkit) {

  // get ambassador from account
  let ambassador = await models.Ambassador.findOne({ where: {

    account_id: req.account.id

  }});

  if (!ambassador) {

    return h.response('ambassador not found').code(404);

  }

  let ambassador_accounts = await models.Account.findAll({

    where: {

      ambassador_id: ambassador.id

    },

    include: [{

      model: models.AmbassadorReward,

      as: 'ambassador_rewards',

      where: {

        ambassador_account_id: req.account.id

      }

    }]

  });

  return {
    ambassador,
    ambassador_accounts
  }
 
  // list all accounts  

}

