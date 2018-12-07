import { models, log } from './';

export async function listAll() {

  log.info('ambassadors.listall');

  let resp = await models.Ambassador.findAll();

  return resp;

}

export async function register(accountId: number, name?: string) {

  let account = await models.Account.findOne({ where: { id: accountId }});

  if (!account) {

    throw new Error(`account ${accountId} not found`);

  }

  let ambassador = await models.Ambassador.findOne({ where:{account_id:accountId}})
  if(ambassador){

    throw new Error('Account is already an ambassador')

  }

  log.info('ambassadors.register', { accountId, name });

  let resp = await models.Ambassador.create({ 
  
    account_id: accountId,
    name: name
   
    });

  return resp;

}

export async function create(accountId, name?: string): Promise<any>{

  return await register(accountId, name)

}

export async function createTeam(ambassadorId, teamName):Promise<any>{

  log.info('ambassadors.team.created', {teamName });

  let ambassador = await models.Ambassador.findOne({ where: { id: ambassadorId }});
  
  let account = await models.Account.findOne({ where: { id: ambassador.account_id } })

  let teamCheck = await models.AmbassadorTeam.findOne({where: {team_name:teamName}})

  if(teamCheck){

    throw new Error(`Team name ${teamName} is already taken`)

  }
     
  let resp = await models.AmbassadorTeam.create({
      team_name:teamName,
      leader_account_id: account.id,
	  
  })

  let team = await models.AmbassadorTeam.findOne({where: {team_name:teamName}})
       
  await addTeamMember(team.id, ambassador.account_id, ambassador.id)

  return resp

}

export async function addTeamMember(teamId, accountId, ambassadorId){

  log.info('ambassadors.team.addMember', { accountId });

  let resp = await models.AmbassadorTeamMember.create({
    team_id:teamId,
    account_id:accountId,
    ambassador_id:ambassadorId
  })

  return resp

}

export async function claimBusiness(ambassadorEmail: string, merchantEmail: string) {

  log.info('ambassadors.claimBussiness', { ambassadorEmail, merchantEmail });

  let ambassadorAccount = await models.Account.findOne({ where: {

    email: ambassadorEmail

  }});

  if (!ambassadorAccount) {
    throw new Error(`account ${ambassadorEmail} not found`);
  }

  let ambassador = await models.Ambassador.findOne({

    where: {

      account_id: ambassadorAccount.id

    }

  });

  if (!ambassador) {
    throw new Error(`ambassador ${ambassadorEmail} not found`);
  }

  let merchantAccount = await models.Account.findOne({ where: {
  
    email: merchantEmail
    
  }});

  if (!merchantAccount) {
    throw new Error(`account ${merchantEmail} not found`);
  }

  let merchant = await models.DashBackMerchant.findOne({ where: {

    account_id: merchantAccount.id
    
  }});

  merchant.ambassador_id = ambassador.id;

  await merchant.save();

  return {

    ambassador: ambassador.toJSON(),

    merchant: merchant.toJSON()
    
  };

}

export async function createClaim(ambassadorEmail: string, merchantEmail: string) {

  log.info('ambassadors.claimBussiness', { ambassadorEmail, merchantEmail });

  let ambassadorAccount = await models.Account.findOne({ where: {

    email: ambassadorEmail

  }});

  if (!ambassadorAccount) {
    throw new Error(`account ${ambassadorEmail} not found`);
  }

  let ambassador = await models.Ambassador.findOne({

    where: {

      account_id: ambassadorAccount.id

    }

  });

  if (!ambassador) {
    throw new Error(`ambassador ${ambassadorEmail} not found`);
  }

  let merchantAccount = await models.Account.findOne({ where: {
  
    email: merchantEmail
    
  }});

  if (!merchantAccount) {
    throw new Error(`account ${merchantEmail} not found`);
  }

  let merchant = await models.DashBackMerchant.findOne({ where: {

    account_id: merchantAccount.id
    
  }});

  let claim = await models.AmbassadorClaim.create({

    ambassador_id: ambassador.id,

    merchant_id: merchant.id
  })

  return claim;

}

export async function listUnverifiedClaims() {

  let claims = await models.AmbassadorClaim.findAll({ where: {

    status: 'unverified'

  }});

  return claims;

}

export async function listAccountClaims(email: string) {

  let account = await models.Account.findOne({ where: { email }});

  let ambassador = await models.Ambassador.findOne({ where: {
  
    account_id: account.id
    
  }});

  let claims = await models.AmbassadorClaim.findAll({ where: {

    ambassador_id: ambassador.id

  }});

  return claims;

}

export async function rejectClaim(claimId: number) {

  log.info('ambassadors.claim.reject', {claimId });

  let claim = await models.AmbassadorClaim.findOne({ where: {

    id: claimId

  }});

  claim.status = 'rejected';

  await claim.save();

  return claim

}

export async function verifyClaim(claimId: number) {

  log.info('ambassadors.claim.approve', {claimId });

  let claim = await models.AmbassadorClaim.findOne({ where: {

    id: claimId

  }});

  await models.DashBackMerchant.update({

    ambassador_id: claim.ambassador_id

  }, {

    where: {

      id: claim.merchant_id

    }
  
  });

  claim.status = 'verified';

  await claim.save();

  return claim

}

export async function listAmbassadorTeamMembers(teamId): Promise<any>{
 
  let resp = await models.AmbassadorTeamMember.findAll({ where: {team_id:teamId}})  

  return resp
}

export async function listAmbassadorTeamJoinRequests(teamId): Promise<any>{

  let resp = await models.AmbassadorTeamJoinRequest.findAll({ where: {team_id:teamId, status: "pending"}})  

  return resp
}

export async function requestToJoinAmbassadorTeam(ambassadorId, teamId): Promise<any>{

  let ambassador = await models.Ambassador.findOne({ where: { id: ambassadorId }});

  let resp = await models.AmbassadorTeamJoinRequest.create({  

   account_id: ambassador.account_id,

   team_id: teamId,

   status: "pending"
 
  })

  return resp

}

export async function rejectAmbassadorTeamJoinRequest(joinRequestId): Promise<any>{

  log.info('ambassadors.joinrequest.reject', {joinRequestId });

  let resp = await models.AmbassadorTeamJoinRequest.destroy({where: {id: joinRequestId}});

  return resp

}

export async function acceptAmbassadorTeamJoinRequest(joinRequestId): Promise<any>{

  log.info('ambassadors.joinrequest.accept', {joinRequestId });

  let joinRequest = await models.AmbassadorTeamJoinRequest.findOne({ where: {id:joinRequestId}})

  let ambassador = await models.Ambassador.findOne({ where: { account_id: joinRequest.account_id }});

  let resp = await addTeamMember(joinRequest.team_id, ambassador.account_id, ambassador.id)

  let req = await models.AmbassadorTeamJoinRequest.destroy({where: {id: joinRequestId}});

  return resp

}
