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

module.exports.listJoinRequests = async function(req: Request, h: ResponseToolkit){


}


module.exports.createAmbassador = async function(req: Request, h: ResponseToolkit){
 
  let ambassador = await ambassadors.create(req.account.id,req.payload.name)

  return ambassador 

}

module.exports.createTeam = async function(req: Request, h: ResponseToolkit){

  let ambassador = await models.Ambassador.findOne({ where: {account_id: req.account.id}})

  let team = await ambassadors.createTeam(ambassador.id, req.payload.teamName)

  return team

}

module.exports.createJoinRequest = async function(req: Request, h: ResponseToolkit){

  //FIX THIS
  //Had an issue calling this function from server.ts so created anonymous function in server.ts 

  return null

}

module.exports.createClaim = async function(req: Request, h: ResponseToolkit){

let merchant = await models.Account.findOne({ where: { id:req.params.merchantId }})

  let claim = await ambassadors.createClaim(req.account.email(),merchant.email()) 

  return claim

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
