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

    var teamName, joinRequest, joiningAmbassador, account, ambassador, team,joiningAccount, merchantEmail, ambassadorEmail, merchant;
   

    before(async()=>{
    
      teamName = chance.word()

      merchantEmail = chance.email()

      ambassadorEmail = chance.email()

      account = await lib.accounts.create(merchantEmail, chance.word())
     
      ambassador = await lib.ambassadors.create(account.id)

      team = await lib.ambassadors.createTeam(ambassador.id, teamName)

      joiningAccount = await lib.accounts.create(ambassadorEmail, teamName)

      joiningAmbassador = await lib.ambassadors.create(joiningAccount.id)

      joinRequest = await lib.ambassadors.requestToJoinAmbassadorTeam(joiningAmbassador.id, teamName)
      
      merchant = await lib.models.DashBackMerchant.create({

        account_id:account.id,

      })

    })

   it("GET /ambassadors/teams should list all teams", async()=>{
     
      let resp = await server.inject({
        method: 'GET',
        url: `/ambassadors/teams`
       })

       assert(resp.length > 0)

    })

    it("GET /ambassadors should list all ambassadors", async()=>{

      let resp = await server.inject({
        method: 'GET',
        url: `/ambassadors`
       })

       assert(resp.length > 0)

    })

    it("GET /ambassador/teams/{team.id} should list all members of team", async()=>{

      let account = await lib.accounts.create(chance.email(), chance.word())

      let team = await lib.ambassadors.createTeam( account.id, chance.email())

      let url = "/ambassador/teams/" + team.id

      let resp = await server.inject({
        method: "GET",
	url: url
       })

       assert(resp.length > 0)

     })

     it("GET /ambassador/teams/{teamName}/join-requests should list all request to  ambassador team", async()=>{

       let url = "/ambassadors/teams/" +teamName+"/join-requests"

       let response = await server.inject({
        method: 'POST',
	url: url,
        headers: {
         'Authorization': auth(accessToken.uid, "")
        }
      })

      assert(response.id > 0);

    })

    it("GET /ambassadors/claims should list all claims", async()=>{

      let claim = await lib.ambassadors.createClaim(merchantEmail,ambassadorEmail)

      let resp = await server.inject({
        method: 'GET',
	url: `/ambassadors/claims`
       })

       assert(resp.length > 0)

    })

  })
  
  describe("Creating resources", ()=>{
  
    var merchant, account, accessToken, ambassador;

    before( async ()=>{

      account = await lib.accounts.create(chance.email(), chance.word())
     
      accessToken = await AccessToken.create({
        account_id: account.id
      })

      ambassador = await lib.ambassadors.create(account.id)

      merchant = await lib.models.DashBackMerchant.create({

        account_id:account.id,

      })

    })
    
    it("POST /ambassadors should create an ambassador", async()=>{

      let name = chance.word()
       
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

      assert(response.id > 0);

    })

    it("POST /ambassadors/teams  should create an ambassador team", async()=>{

      let account1 = await lib.accounts.create(chance.email(), chance.word())

      let ambassador = await lib.ambassadors.create(account1.id)

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

      assert(response.id > 0);
    
    })

    it("POST /ambassadors/teams/${teamName}/join-requests should create join request to ambassador team", async()=>{

      let teamName = chance.word()

      let team = await lib.ambassadors.createTeam(ambassador.id,teamName)

      let url = "ambassadors/teams/"+teamName+"join-requests"

      let response = await server.inject({
        method: 'POST',
	url: url,
        headers: {
         'Authorization': auth(accessToken.uid, "")
        } 
      })

      assert(response.id > 0);
    
    })

    it("POST /ambassadors/claims/{merchant.id} should create an ambassador claim", async()=>{

      let url = "ambassadors/claims/" + merchant.id

      let response = await server.inject({
        method: 'POST',
	url: url, 
        payload: {
          merchantId: merchant.id,
        },
        headers: {
          'Authorization': auth(accessToken.uid, "")
        }
      })

      assert(response.id > 0);

    })

  })

  describe("Controlling resources", ()=>{

    var teamName, joinRequest, joiningAmbassador, account, ambassador, team,joiningAccount, merchantEmail, ambassadorEmail, merchant;
   
    before(async()=>{
    
      teamName = chance.word()

      merchantEmail = chance.email()

      ambassadorEmail = chance.email()

      account = await lib.accounts.create(merchantEmail, chance.word())
     
      ambassador = await lib.ambassadors.create(account.id)

      team = await lib.ambassadors.createTeam(ambassador.id, chance.word())

      joiningAccount = await lib.accounts.create(ambassadorEmail, teamName)

      joiningAmbassador = await lib.ambassadors.create(joiningAccount.id)

      joinRequest = await lib.ambassadors.requestToJoinAmbassadorTeam(joiningAmbassador.id,team.id)
      
      merchant = await lib.models.DashBackMerchant.create({

        account_id:account.id,

      })

    })

    it("POST /ambassadors/teams/join/{request-id}/accept  should accept join request to ambassador team", async()=>{

      let url = "/ambassadors/teams/join-requests"+joinRequest.id+"accept"

      let response = await server.inject({
        method: 'POST',
	url: url,
        headers: {
         'Authorization': auth(accessToken.uid, "")
        }
      })

      assert(response.id > 0);

    })

    it("POST /ambassadors/teams/join-requests/{reqId}/reject should reject a  join request to ambassador team", async()=>{

      let url = "/ambassadors/teams/join-requests/" + joinRequest.id + "/reject"
      let response = await server.inject({
        method: 'POST',
        url: url,
        headers: {
         'Authorization': auth(accessToken.uid, "")
        }
      })

      assert(response.id > 0);

     })

    it("POST /ambassadors/claims/{claimID}/verify should verify a claim", async()=>{

      let claim = await lib.ambassadors.createClaim(merchantEmail,ambassadorEmail)

      let url = "/ambassadors/claims/" + claim.id + "/verify"

      let resp = await server.inject({
        method: 'POST',
	url: url, 
	headers: {
          'Authorization': auth(accessToken.uid, "")
	}
       })

       assert(resp.id > 0)
      
    })

    it("POST /ambassadors/claims/{claimID}/reject should reject a claim", async()=>{

      let claim = await lib.ambassadors.createClaim(merchantEmail,ambassadorEmail)

      let url = "/ambassadors/claims/" + claim.id + "reject"

      let resp = await server.inject({
        method: 'POST',
	url: url, 
	headers: {
          'Authorization': auth(accessToken.uid, "")
	}
       })

       assert(resp.id > 0)

    })

  })

})
function auth(username, password) {
  return "Basic " + new Buffer(username + ':' + password).toString('base64');
}
