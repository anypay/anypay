import {Server} from '../../servers/rest_api/server';
import * assert from 'assert';
import * as lib fro, '../../lib';
const Database =require('../../lib/database');
const AccessToken = require("../../lib/models/access_token");

import * as Chance from 'chance';
const chance = new Chance();

describe("Ambassador REST API", ()=>{
  let server, accessToken;

  before( async ()=>{

    await Database.sync();
    server = await Server();

  });
  
  describe("Creating ambassador and teams", ()=>{
   
    it("GET /ambassador/teams should list all teams", async()=>{

      let account = await lib.accounts.create(chance.email(), chance.word())

      await lib.ambassadors.createTeam( account.id, chance.email())
     
      let resp = await server.inject({
        method: 'GET',
        url: `/ambassador/teams`
       })

       assert.strictEqual(resp.length > 0)

    }
    
    it("GET /ambassador should list all ambassadors", async()=>{

      let account = await lib.accounts.create(chance.email(), chance.word())

      await lib.ambassadors.create(account.id)

      let resp = await server.inject({
        method: 'GET',
        url: `/ambassador`
       })

       assert.strictEqual(resp.length > 0)

    }

    it("GET /ambassador/teams/{team.id} should list all members of team", async()=>{

      let account = await lib.accounts.create(chance.email(), chance.word())

      let team = await lib.ambassadors.createTeam( account.id, chance.email())

      let resp = await server.inject({
        method: 'GET',
	url: `/ambassador/teams/${team.id}`
       })

       assert.strictEqual(resp.length > 0)

    }
    
    it("POST /ambassadors should create an ambassador", async()=>{

      let name = chance.word()

      let account = await lib.accounts.create(chance.email(), chance.word())

      accessToken = await AccessToken.create({
        account_id: account.id
      })
      
      let response = await server.inject({
        method: 'POST',
	url: '/ambassadors'
        payload: {
          name: name
        },
        headers: {
          'Authorization': auth(accessToken.uid, "")
        }
      })

      assert.strictEqual(response.id > 0);

    })

    it("POST /ambassador/teams/create  should create an ambassador team", async(){

      let account = await lib.accounts.create(chance.email(), chance.word())

      let ambassador = await lib.ambassador.create(account.id)

      let teamName = chance.word()

      accessToken = await AccessToken.create({
        account_id: account.id
      })

      let response = await server.inject({
        method: 'POST',
	url: '/ambassador/teams/create'
        payload: {
          teamName:teamName,
        },
        headers: {
         'Authorization': auth(accessToken.uid, "")
        } 
      })

      assert.strictEqual(response.id > 0);
    
    })

   it("POST /ambassador/teams/join/{teamName}  should create join request to ambassador team", async(){

      let account = await lib.accounts.create(chance.email(), chance.word())

      let ambassador = await lib.ambassador.create(account.id)

      let teamName = chance.word()

      accessToken = await AccessToken.create({
        account_id: account.id
      })

      let response = await server.inject({
        method: 'POST',
	url: `/ambassador/teams/join/${teamName}`,
        headers: {
         'Authorization': auth(accessToken.uid, "")
        } 
      })

      assert.strictEqual(response.id > 0);
    
    })

   it("POST /ambassador/teams/join/{reqId}/accept  should accept join request to ambassador team", async(){

      let account = await lib.accounts.create(chance.email(), chance.word())

      let ambassador = await lib.ambassador.create(account.id)

      let teamName = chance.word()

      let team = await lib.ambassadors.createTeam(ambassador.id, teamName)

      let joiningAccount = await lib.accounts.create(chance.email(), chance.word())

      let joiningAmbassador = await lib.ambassador.create(joiningAccount.id)
      
      let joinReq = await lib.ambassadors.requestToJoinAmbassadorTeam(joinAmbassador.id)

      let teamName = chance.word()

      accessToken = await AccessToken.create({
        account_id: account.id
      })

      let response = await server.inject({
        method: 'POST',
	url: `/ambassador/teams/join/${joinReq.id}/accept`,
        headers: {
         'Authorization': auth(accessToken.uid, "")
        }
      })

      assert.strictEqual(response.id > 0);

    })

    it("POST /ambassador/teams/join/{reqId}/reject  should reject a  join request to ambassador team", async(){

      let account = await lib.accounts.create(chance.email(), chance.word())

      let ambassador = await lib.ambassador.create(account.id)

      let teamName = chance.word()

      let team = await lib.ambassadors.createTeam(ambassador.id, teamName)

      let joiningAccount = await lib.accounts.create(chance.email(), chance.word())

      let joiningAmbassador = await lib.ambassador.create(joiningAccount.id)

      let joinReq = await lib.ambassadors.requestToJoinAmbassadorTeam(joinAmbassador.id)

      let teamName = chance.word()

      accessToken = await AccessToken.create({
        account_id: account.id
      })

      let response = await server.inject({
        method: 'POST',
        url: `/ambassador/teams/join/${joinReq.id}/reject`,
        headers: {
         'Authorization': auth(accessToken.uid, "")
        }
      })

      assert.strictEqual(response.id > 0);

     })

     it("GET /ambassador/teams/join/{teamName}  should list all request to  ambassador team", async(){

      let account = await lib.accounts.create(chance.email(), chance.word())

      let ambassador = await lib.ambassador.create(account.id)

      let teamName = chance.word()

      let team = await lib.ambassadors.createTeam(ambassador.id, teamName)

      let joiningAccount = await lib.accounts.create(chance.email(), chance.word())

      let joiningAmbassador = await lib.ambassador.create(joiningAccount.id)

      let joinReq = await lib.ambassadors.requestToJoinAmbassadorTeam(joinAmbassador.id)


      accessToken = await AccessToken.create({
        account_id: account.id
      })

      let response = await server.inject({
        method: 'POST',
	url: `/ambassador/teams/join/${teamName}`,
        headers: {
         'Authorization': auth(accessToken.uid, "")
        }
      })

      assert.strictEqual(response.id > 0);

    })


  })

  describe("Claiming a bussiness", ()=>{
    var merchantEmail, ambassadorEmail, account, merchant, ambassadorAccount, ambassador, accessToken;

    before(async()=>{
     
      merchantEmail = chance.email()

      ambassadorEmail = chance.email()

      account = await lib.accounts.create(merchantEmail, chance.word())

      merchant = await models.DashBackMerchant.create({

        account_id:account.id,

      })

      ambassadorAccount = await lib.accounts.create(ambassadorEmail, chance.word())

      ambassador = await lib.ambassador.create(ambassadorAccount.id)

      accessToken = await AccessToken.create({
        account_id: account.id
      })

    })

    it("GET /ambassador/claims/create should list all claims", async()=>{

      let claim = await lib.ambassadors.createClaim(merchantEmail,ambassadorEmail)

      let resp = await server.inject({
        method: 'GET',
	url: `/ambassador/claims/create`
       })

       assert.strictEqual(resp.length > 0)

    }

    it("GET /ambassador/claims/verified should list all verified  claims", async()=>{

      let claim = await lib.ambassadors.createClaim(merchantEmail,ambassadorEmail)
        
      let resp = await server.inject({
        method: 'GET',
	url: `/ambassador/claims/verified`
       })

       assert.strictEqual(resp.length > 0)
    
    }

    it("GET /ambassador/claims/rejected should list all rejected  claims", async()=>{

      let claim = await lib.ambassadors.createClaim(merchantEmail,ambassadorEmail)

      let resp = await server.inject({
        method: 'GET',
        url: `/ambassador/claims/verified`
       })

       assert.strictEqual(resp.length > 0)

    }



    it("POST /ambassador/claims should create an ambassador claim", async()=>{

      let response = await server.inject({
        method: 'POST',
        url: '/ambassador/claims'
        payload: {
          ambassadorEmail:ambassadorEmail,
  	  merchantEmail:merchantEmail
        },
        headers: {
          'Authorization': auth(accessToken.uid, "")
        }
      })

      assert.strictEqual(response.id > 0);

    })

    //Team leader will call this
    it("POST /ambassador/claims/{claimID}/verify should verify a claim", async()=>{

      let claim = await lib.ambassadors.createClaim(merchantEmail,ambassadorEmail)

      let resp = await server.inject({
        method: 'POST',
	url: `/ambassador/claims/${claim.id}/verify`
	headers: {
          'Authorization': auth(accessToken.uid, "")
	}
       })

       assert.strictEqual(response.id > 0)
      
    })

    it("POST /ambassador/claims/{claimID}/reject should reject a claim", async()=>{

      let claim = await lib.ambassadors.createClaim(merchantEmail,ambassadorEmail)

      let resp = await server.inject({
        method: 'POST',
	url: `/ambassador/claims/${claim.id}/reject`
	headers: {
          'Authorization': auth(accessToken.uid, "")
	}
       })

       assert.strictEqual(response.id > 0)

    })

  })




})

function auth(username, password) {
  return `Basic ${new Buffer(username + ':' + password).toString('base64')}`;
}
