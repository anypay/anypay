import * as Hapi from 'hapi';

import { Request, ResponseToolkit } from 'hapi';

import { models, ambassadors } from '../../../lib';

module.exports.list_account_claims = async function(req: Hapi.Request, h: Hapi.ResponseToolkit) {

  let accountId = req.auth.credentials.accessToken.account_id;

  let account = await models.Account.findOne({ where: { id: accountId }});

  return ambassadors.listAccountClaims(account.email);

};

module.exports.claim_merchant = async function(req: Hapi.Request, h: Hapi.ResponseToolkit) {

  let accountId = req.auth.credentials.accessToken.account_id;

  let account = await models.Account.findOne({ where: { id: accountId }});

  return ambassadors.claimBusiness(

    account.email,

    req.body.merchantEmail
    
  );

};

module.exports.list = async function(req: Request, h: ResponseToolkit) {

  let ambassadors = await models.Ambassador.findAll();

  return { ambassadors };

};

module.exports.listTeams = async function(req: Request, h: ResponseToolkit){


}

module.exports.listTeamMembers = async function(req: Request, h: ResponseToolkit){


}

module.exports.listTeamJoinRequests = async function(req: Request, h: ResponseToolkit){


}

module.exports.listClaims = async function(req: Request, h: ResponseToolkit){


}

module.exports.createAmbassador = async function(req: Request, h: ResponseToolkit){


}

module.exports.createTeam = async function(req: Request, h: ResponseToolkit){


}

module.exports.createJoinRequesrt = async function(req: Request, h: ResponseToolkit){


}

module.exports.createClaim = async function(req: Request, h: ResponseToolkit){


}

module.exports.acceptJoinRequest = async function(req: Request, h: ResponseToolkit){


}

module.exports.rejectJoinRequest = async function(req: Request, h: ResponseToolkit){


}
module.exports.acceptClaim = async function(req: Request, h: ResponseToolkit){


}

module.exports.rejectClaim = async function(req: Request, h: ResponseToolkit){


}

module.exports.listTeamJoinRequests = async function(req: Request, h: ResponseToolkit){


}
module.exports.createJoinRequest = async function(req: Request, h: ResponseToolkit){


}
