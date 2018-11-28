require('dotenv').config();

import * as lib from '../../lib';
import * as assert from 'assert';
import * as Chance from 'chance';

const chance = new Chance();

describe('Ambassador Teams Library', () => {

  describe("Creating A Team", () => {


    it('should fail without a valid ambassador id', async () => {

      let teamName = `${chance.word()} ${chance.word()}`;

      let invalidAmbassadorId = 348938493;

      try {

        lib.ambassadors.createTeam(invalidAmbassadorId, teamName);

      } catch(error) {

        assert.strictEqual(error.message, 'invalid ambassador id');

      }

    });

    
    it('should be created with valid ambassador id and name', async () => {
     

      let teamName = `${chance.word()} ${chance.word()}`;

      let email = chance.email()

      let password = `${chance.word()} ${chance.word()} ${chance.word()}`;

      let account = await lib.accounts.create(email, password);

      let ambassador = await lib.ambassadors.create(account.id);

      let team = await lib.ambassadors.createTeam(ambassador.id, teamName);

      assert(team.id > 0);

      assert.strictEqual(team.team_name, teamName);

      assert.strictEqual(team.leader_account_id, account.id)


    });
  
  });

  describe("Requesting to join a team", ()=>{
  
    var ambassadorTeam, teamLeader;

    before(async ()=>{
    
      let teamName = `${chance.word()} ${chance.word()}`;
      
      let email = chance.email();
     
      let password = chance.word();

      let account = await lib.accounts.create(email, password);

      teamLeader = await lib.ambassadors.create(account.id);

      ambassadorTeam = await lib.ambassadors.createTeam(teamLeader.id, teamName);

    })

    it('should create a team and the only member should be the team lead', async() =>{

      let teamMembers = await lib.ambassadors.listAmbassadorTeamMembers(ambassadorTeam.id);

      let joinRequests = await lib.ambassadors.listAmbassadorTeamJoinRequests(ambassadorTeam.id);

      assert.strictEqual(teamMembers.length, 1);
      assert.strictEqual(joinRequests.length, 0);

    })  

  it('ambassador should ask to join a team, and be rejected', async () => {

       /* Now Team Is Set Up But Nobody Has Yet Requested To Join */

      let email = chance.email();

      let password = chance.word();
    
      let account = await lib.accounts.create(email, password);

      let ambassador = await lib.ambassadors.create(account.id);
   
      let joinRequest = await lib.ambassadors.requestToJoinAmbassadorTeam(ambassador.id, ambassadorTeam.id);

      let joinRequests = await lib.ambassadors.listAmbassadorTeamJoinRequests(ambassadorTeam.id);

      assert.strictEqual(joinRequests.length, 1);

      await lib.ambassadors.rejectAmbassadorTeamJoinRequest(joinRequest.id);

      joinRequests = await lib.ambassadors.listAmbassadorTeamJoinRequests(ambassadorTeam.id);

      assert.strictEqual(joinRequests.length, 0);

    })

    it('ambassador should ask to join a team and be accepted', async () =>{
 
      let email = chance.email();

      let password = chance.word();
    
      let account = await lib.accounts.create(email, password);

      let ambassador = await lib.ambassadors.create(account.id);
   
      let joinRequest = await lib.ambassadors.requestToJoinAmbassadorTeam(ambassador.id, ambassadorTeam.id);

      let joinRequests = await lib.ambassadors.listAmbassadorTeamJoinRequests(ambassadorTeam.id);

      assert.strictEqual(joinRequests.length, 1); 

      await lib.ambassadors.acceptAmbassadorTeamJoinRequest(joinRequest.id);

      joinRequests = await lib.ambassadors.listAmbassadorTeamJoinRequests(ambassadorTeam.id);

      assert.strictEqual(joinRequests.length, 0);

      let teamMembers = await lib.ambassadors.listAmbassadorTeamMembers(ambassadorTeam.id);

      assert.strictEqual(teamMembers.length, 2);
   
    });
  
  });
});
