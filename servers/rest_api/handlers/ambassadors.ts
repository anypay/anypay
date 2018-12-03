import * as Hapi from 'hapi';

import { Request, ResponseToolkit } from 'hapi';

import { models, ambassadors, database } from '../../../lib';

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

  let teams = await models.AmbassadorTeam.findAll();

  return {teams}

}

module.exports.listTeamMembers = async function(req: Request, h: ResponseToolkit){
  
  let members = await models.AmbassadorTeamMember.findAll({where:{team_id:req.params.teamId}})

  return {members}

}

module.exports.listTeamJoinRequests = async function(req: Request, h: ResponseToolkit){

  let requests = await models.AmbassadorTeamJoinRequest.findAll({where:{ team_id: req.params.teamId}})


  return {requests}
}

module.exports.listClaims = async function(req: Request, h: ResponseToolkit){
 
 let claims = await models.AmbassadorClaim.findAll();

 return {claims}

}

module.exports.listJoinRequests = async function(req: Request, h: ResponseToolkit){

  let joins = await models.AmbassadorTeamJoinRequest.findAll();

  return {joins}

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

module.exports.createClaim = async function(req: Request, h: ResponseToolkit){


  let merchant = await models.DashBackMerchant.findOne({ where: { id:req.params.merchantId }})

  let merchantAccount = await models.Account.findOne({where:{id:merchant.account_id}})

  let claim = await ambassadors.createClaim(req.account.email,merchantAccount.email) 

  return claim

}

module.exports.acceptJoinRequest = async function(req: Request, h: ResponseToolkit){

  let resp = await ambassadors.acceptAmbassadorTeamJoinRequest(req.params.requestId)

  return resp

}

module.exports.rejectJoinRequest = async function(req: Request, h: ResponseToolkit){

  let resp = await ambassadors.rejectAmbassadorTeamJoinRequest(req.params.joinRequestId)

  return resp

}
module.exports.acceptClaim = async function(req: Request, h: ResponseToolkit){

  let resp = await ambassadors.verifyClaim(req.params.claimId)

  return resp
}

module.exports.rejectClaim = async function(req: Request, h: ResponseToolkit){

  let resp = await ambassadors.rejectClaim(req.params.claimId)

  return resp

}

module.exports.listTeamJoinRequests = async function(req: Request, h: ResponseToolkit){

  let team = await models.AmbassadorTeam.findOne({where:{id: req.params.teamId}})

  if( req.account.id != team.leader_account_id ){
   
    return null

  }
  let requests = await models.AmbassadorTeamJoinRequest.findAll({where:{ team_id: req.params.teamId}})

  return {requests}

}
module.exports.createJoinRequest = async function(req: Request, h: ResponseToolkit){

  let ambassador = await models.Ambassador.findOne({ where:{account_id: req.account.id}})

  let team = await models.AmbassadorTeam.findOne({where:{team_name:req.params.teamName}})

  let join = await ambassadors.requestToJoinAmbassadorTeam(ambassador.id, team.id)

  return join

}
