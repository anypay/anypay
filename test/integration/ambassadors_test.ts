import {Server} from '../../servers/rest_api/server';
import * as assert from 'assert';
import * as lib from '../../lib';
const Database = require('../../lib/database');
const AccessToken = require("../../lib/models/access_token");

import * as Chance from 'chance';
const chance = new Chance();

describe("Ambassador REST API", ()=>{
  let server, accessToken;

  before( async ()=>{

    await Database.sync();
    server = await Server();

  });

  describe("Retrieving collections", ()=>{

    var teamLeaderAccount, teamLeaderAmbassador, claim, merchantAccount, teamName, joinRequest, joiningAmbassador, account, ambassador, team,joiningAccount, merchantEmail, ambassadorEmail, merchant;
   

    before(async()=>{
     
      teamName = chance.word()

      merchantEmail = chance.email()

      ambassadorEmail = chance.email()

      merchantAccount = await lib.accounts.create(merchantEmail, chance.word())

      teamLeaderAccount = await lib.accounts.create(chance.email(), chance.word())

      teamLeaderAmbassador = await lib.ambassadors.create(teamLeaderAccount.id)

      team = await lib.ambassadors.createTeam(teamLeaderAmbassador.id, teamName)

      joiningAccount = await lib.accounts.create(ambassadorEmail, teamName)

      joiningAmbassador = await lib.ambassadors.create(joiningAccount.id)
  
      joinRequest = await lib.ambassadors.requestToJoinAmbassadorTeam(joiningAmbassador.id, team.id)
    
      let acc = await lib.accounts.create(chance.email(), chance.word())
      
      let ambassador2 = await lib.ambassadors.create(acc.id)

      await lib.ambassadors.requestToJoinAmbassadorTeam(ambassador2.id, team.id)

      merchant = await lib.models.DashBackMerchant.create({

        account_id:merchantAccount.id,

      })

      await lib.ambassadors.acceptAmbassadorTeamJoinRequest(joinRequest.id)

      claim = await lib.ambassadors.createClaim(ambassadorEmail, merchantEmail)
     
    })

   it("GET /ambassadors/teams should list all teams", async()=>{
     
      let resp = await server.inject({
        method: 'GET',
        url: `/ambassadors/teams`
       })

       assert(resp.result.teams.length > 0)

    })

    it("GET /ambassadors should list all ambassadors", async()=>{

      let resp = await server.inject({
        method: 'GET',
        url: `/ambassadors`
       })

       assert(resp.result.ambassadors.length > 0)

    })

    it("GET /ambassador/teams/{team.id} should list all members of team", async()=>{

      let resp = await server.inject({
        method: "GET",
	url: `/ambassadors/teams/${team.id}`,
	payload:{
          teamId: team.id
	},
       })

       assert(resp.result.members.length > 0)

     })

     it("GET /ambassador/teams/{teamid}/join-requests should list all request to  ambassador team", async()=>{


       let response = await server.inject({
        method: 'GET',
	url: `/ambassadors/teams/${team.id}/join-requests`,
	payload: {
	  teamId:team.id
	}
      })

      assert(response.result.requests.length > 0);

    })

    it("GET /ambassadors/claims should list all claims", async()=>{


      let resp = await server.inject({
        method: 'GET',
	url: `/ambassadors/claims`
       })

       assert(resp.result.claims.length > 0)

    })

  })
  
  describe("Creating resources", ()=>{

    it("POST /ambassadors should create an ambassador", async()=>{

      let name = chance.word()

      let account = await lib.accounts.create(chance.email(), chance.word())

      accessToken = await AccessToken.create({
        account_id: account.id
      })
       
      let response = await server.inject({
        method: 'POST',
	url: '/ambassadors',
        payload: {
          name: name
        },
        headers: {
          'Authorization': auth(accessToken.uid, "")
        }
      })

      assert(response.result.id > 0);
      assert.strictEqual(response.result.account_id, account.id)

    })

    it("POST /ambassadors/teams  should create an ambassador team", async()=>{

      let account = await lib.accounts.create(chance.email(), chance.word())

      let ambassador = await lib.ambassadors.create(account.id)

      let teamName1 = chance.word()

      accessToken = await AccessToken.create({
        account_id: account.id
      })

      let response = await server.inject({
        method: 'POST',
	url: '/ambassadors/teams',
        payload: {
          teamName:teamName1,
        },
        headers: {
         'Authorization': auth(accessToken.uid, "")
        } 
      })

      assert(response.result.id > 0 )
      assert(response.result.team_name, teamName1);
    
    })

    it("POST /ambassadors/teams/${teamName}/join-requests should create join request to ambassador team", async()=>{

      let teamName = chance.word()

      let account = await lib.accounts.create(chance.email(), chance.word())

      let ambassador = await lib.ambassadors.create(account.id)

      let team = await lib.ambassadors.createTeam(ambassador.id,teamName)

      accessToken = await AccessToken.create({
        account_id: account.id
      })
       
      console.log(`/ambassadors/teams/${team.team_name}/join-requests`)
      let response = await server.inject({
        method: 'POST',
	url: `/ambassadors/teams/${team.team_name}/join-requests`,
        headers: {
         'Authorization': auth(accessToken.uid, "")
        } 
      })

      assert(response.result.id > 0);
    
    })

    it("POST /ambassadors/claims/{merchant.id} should create an ambassador claim", async()=>{

      let merchantAccount = await lib.accounts.create(chance.email(), chance.word())

      let merchantEmail = await chance.email() 

      let claimingAccount = await lib.accounts.create(chance.email(), chance.word())

      let claimingAmbassador = await lib.ambassadors.create(claimingAccount.id)

      let merchant = await lib.models.DashBackMerchant.create({

        account_id: merchantAccount.id

      })

      accessToken = await AccessToken.create({
        account_id: claimingAccount.id
      })

      let response = await server.inject({
        method: 'POST',
	url: `/ambassadors/claims/${merchant.id}`, 
        payload: {
          merchantId: merchant.id,
        },
        headers: {
          'Authorization': auth(accessToken.uid, "")
        }
      })

      assert.strictEqual(response.result.ambassador_id, claimingAmbassador.id);

      assert.strictEqual(response.result.merchant_id, merchant.id);

    })

  })

  describe("Controlling resources", ()=>{

    it("POST /ambassadors/teams/join/{request-id}/accept  should accept join request to ambassador team", async()=>{

      let teamName = chance.word()

      let merchantEmail = chance.email()

      let joiningAmbassadorEmail = chance.email()

      let merchantAccount = await lib.accounts.create(merchantEmail, chance.word())

      let merchant = await lib.models.DashBackMerchant.create({

        account_id:merchantAccount.id,

      })

      let joiningAccount = await lib.accounts.create(joiningAmbassadorEmail, teamName)

      let joiningAmbassador = await lib.ambassadors.create(joiningAccount.id)

      let teamLeadAccount = await lib.accounts.create(chance.email(), chance.word())
      
      let teamLeadAmbassador = await lib.ambassadors.create(teamLeadAccount.id)

      let team = await lib.ambassadors.createTeam(teamLeadAmbassador.id, chance.word())

      let joinRequest = await lib.ambassadors.requestToJoinAmbassadorTeam(joiningAmbassador.id,team.id)
 
      accessToken = await AccessToken.create({
        account_id: teamLeadAccount.id
      })


      let response = await server.inject({
        method: 'POST',
	url: `/ambassadors/teams/join-requests/${joinRequest.id}/accept`,
	payload: {
	  joinRequestId: joinRequest.id
	},
        headers: {
         'Authorization': auth(accessToken.uid, "")
        }
      })

      let teamMember = await lib.models.AmbassadorTeamMember.findOne({where: {account_id:joiningAccount.id}})

      assert.strictEqual(teamMember.team_id, team.id);

    })

    it("POST /ambassadors/teams/join-requests/{reqId}/reject should reject a  join request to ambassador team", async()=>{

      let teamName = chance.word()

      let merchantEmail = chance.email()

      let joiningAmbassadorEmail = chance.email()

      let merchantAccount = await lib.accounts.create(merchantEmail, chance.word())

      let merchant = await lib.models.DashBackMerchant.create({

        account_id:merchantAccount.id,

      })

      let joiningAccount = await lib.accounts.create(joiningAmbassadorEmail, teamName)

      let joiningAmbassador = await lib.ambassadors.create(joiningAccount.id)

      let teamLeadAccount = await lib.accounts.create(chance.email(), chance.word())
      
      let teamLeadAmbassador = await lib.ambassadors.create(teamLeadAccount.id)

      let team = await lib.ambassadors.createTeam(teamLeadAmbassador.id, chance.word())

      let joinRequest = await lib.ambassadors.requestToJoinAmbassadorTeam(joiningAmbassador.id,team.id)
 
      accessToken = await AccessToken.create({
        account_id: teamLeadAccount.id
      })


      let response = await server.inject({
        method: 'POST',
	url: `/ambassadors/teams/join-requests/${joinRequest.id}/reject`,
        headers: {
         'Authorization': auth(accessToken.uid, "")
        }
      })

      let teamMember = await lib.models.AmbassadorTeamMember.findOne({where: {account_id:joiningAccount.id}})

      assert.strictEqual(teamMember, null);


    })

    it("POST /ambassadors/claims/{claimID}/reject should reject a claim", async()=>{

      let merchantEmail = chance.email()

      let merchantAccount = await lib.accounts.create(merchantEmail, chance.word())

      let merchant = await lib.models.DashBackMerchant.create({

        account_id:merchantAccount.id

      })

      let teamLeadAccount = await lib.accounts.create(chance.email(), chance.word())

      let teamLeadAmbassador = await lib.ambassadors.create(teamLeadAccount.id)

      let team = await lib.ambassadors.createTeam(teamLeadAmbassador.id, chance.word())

      let claimingAmbassadorEmail = chance.email()

      let claimingAccount = await lib.accounts.create(claimingAmbassadorEmail, chance.word())

      let claimingAmbassador = await lib.ambassadors.create(claimingAccount.id)

      let joinReq = await lib.ambassadors.requestToJoinAmbassadorTeam(claimingAmbassador.id, team.id)

      await lib.ambassadors.acceptAmbassadorTeamJoinRequest(joinReq.id)

      let claim = await lib.ambassadors.createClaim(claimingAmbassadorEmail, merchantEmail)

      accessToken = await AccessToken.create({
	account_id:teamLeadAccount.id
      })

      let response = await server.inject({

        method: 'POST',
	url: `/ambassadors/claims/${claim.id}/reject`,
	payload:{
          claimId:claim.id
	},
	headers:{
	  'Authorization':auth(accessToken.uid,"")
	}

      })

      assert.strictEqual(response.result.status, "rejected")


    })

    it("POST /ambassadors/claims/{claimID}/accept should accept a claim", async()=>{

      let merchantEmail = chance.email()

      let merchantAccount = await lib.accounts.create(merchantEmail, chance.word())

      let merchant = await lib.models.DashBackMerchant.create({

        account_id:merchantAccount.id

      })

      let teamLeadAccount = await lib.accounts.create(chance.email(), chance.word())

      let teamLeadAmbassador = await lib.ambassadors.create(teamLeadAccount.id)

      let team = await lib.ambassadors.createTeam(teamLeadAmbassador.id, chance.word())

      let claimingAmbassadorEmail = chance.email()

      let claimingAccount = await lib.accounts.create(claimingAmbassadorEmail, chance.word())

      let claimingAmbassador = await lib.ambassadors.create(claimingAccount.id)

      let joinReq = await lib.ambassadors.requestToJoinAmbassadorTeam(claimingAmbassador.id, team.id)

      await lib.ambassadors.acceptAmbassadorTeamJoinRequest(joinReq.id)

      let claim = await lib.ambassadors.createClaim(claimingAmbassadorEmail, merchantEmail)

      accessToken = await AccessToken.create({
	account_id:teamLeadAccount.id
      })

      let response = await server.inject({

        method: 'POST',
	url: `/ambassadors/claims/${claim.id}/accept`,
	payload:{
          claimId:claim.id
	},
	headers:{
	  'Authorization':auth(accessToken.uid,"")
	}

      })

      assert.strictEqual(response.result.status, "verified")


    })

  })

})
function auth(username, password) {
  return "Basic " + new Buffer(username + ':' + password).toString('base64');
}
