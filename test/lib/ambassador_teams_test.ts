require('dotenv').config();

import * as lib from '../../lib';
import * as assert from 'assert';
import * as Chance from 'chance';

const chance = new Chance();

describe('Ambassador Teams Library', () => {

  describe("Creating A Team", () => {

    it('should faile without a valid ambassador id', async () => {

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

      let account = await lib.accounts.create(email, password);

      let ambassador = await lib.ambassadors.create(account.id);

      let team = await lib.ambassadors.createTeam(invalidAmbassadorId, teamName);

      assert(team.id > 0);

      assert.strictEqual(team.name, teamName);

    });

  });

  it('ambassador should ask to join a team, be approved or denied', async () => {

    let teamName = `${chance.word()} ${chance.word()}`;
    let email = chance.email();
    let password = chance.word();

    let ambassadorTeam = await lib.ambassadors.createTeam(teamName);

    let account = await lib.accounts.create(email, password);

    let ambassador = await lib.ambassadors.create(account.id);

    let team = await lib.ambassadors.createTeam(ambassador.id, teamName);

    let teamMembers = await lib.ambassadors.listTeamMembers(team.id);

    let joinRequests = await lib.ambassadors.listMemberJoinRequests(team.id);

    assert.strictEqual(teamMembers.length, 1);
    assert.strictEqual(joinRequests.length, 0);

    /* Now Team Is Set Up But Nobody Has Yet Requested To Join */

    let joinRequest = await lib.ambassadors.requestToJoinTeam(ambassador.id, teamMember.id);

    joinRequests = await lib.ambassadors.listMemberJoinRequests(team.id);

    assert.strictEqual(joinRequests.length, 1);

    await lib.ambassadors.rejectJoinRequest(joinRequest.id);

    joinRequests = await lib.ambassadors.listMemberJoinRequests(team.id);
    assert.strictEqual(joinRequests.length, 0);

    let joinRequest = await lib.ambassadors.requestToJoinTeam(ambassador.id, teamMember.id);

    await lib.ambassadors.acceptTeamJoinRequest(joinRequest.id);

    joinRequests = await lib.ambassadors.listMemberJoinRequests(team.id);
    assert.strictEqual(joinRequests.length, 0);

    let teamMembers = await lib.ambassadors.listTeamMembers(team.id);

    assert.strictEqual(teamMembers.length, 2);

  });

  describe("Requesting To Join A Team", () => {

    var teamLeadAmbassador, requestingAmbassador, ambassadorTeam;

    before(async () => {

      let account = await lib.accounts.create(email, password);

      let teamName = `${chance.word()} ${chance.word()}`;

      teamLeadAmbassador = await lib.ambassadors.create(account.id);

      ambassadorTeam = await lib.ambassadors.createTeam(
        teamLeadAmbassador.id,
        teamName
      );

    });

    describe("Rejecting a request to join a team", () => {

      it("#rejectJoinRequest should delete the request", () => {

        let joinRequest = await lib.ambassadors.requestToJoinTeam(
          requestingAmbassador.id, ambassadorTeam.id
        );

        let joinRequests = await lib.ambassadors.listMemberJoinRequests(
          ambassadorTeam
        );

        assert.strictEqual(joinRequests.length, 0);

        let joinRequest = await lib.ambassadors.requestToJoinTeam(
          requestingAmbassador.id,
          ambassadorTeam.id
        );

        assert(joinRequest.id > 0);

        let joinRequests = await lib.ambassadors.listMemberJoinRequests(
          ambassadorTeam
        );

        assert.strictEqual(joinRequests.length, 1);

        await lib.ambassadors.rejectJoinRequest(joinRequest.id);

        let joinRequests = await lib.ambassadors.listMemberJoinRequests(
          ambassadorTeam
        );

        assert.strictEqual(joinRequests.length, 0);

      });

    });

    describe("Accepting a request to join a team", () => {

      it("#acceptJoinRequest should add ambassador to team", () => {

        let joinRequest = await lib.ambassadors.requestToJoinTeam(
          requestingAmbassador.id, ambassadorTeam.id
        );

        let joinRequests = await lib.ambassadors.listMemberJoinRequests(
          ambassadorTeam
        );

        assert.strictEqual(joinRequests.length, 0);

        let joinRequest = await lib.ambassadors.requestToJoinTeam(
          requestingAmbassador.id,
          ambassadorTeam.id
        );

        assert(joinRequest.id > 0);

        let joinRequests = await lib.ambassadors.listMemberJoinRequests(
          ambassadorTeam
        );

        assert.strictEqual(joinRequests.length, 1);

        let teamMembers = await lib.ambassadors.listTeamMembers(team.id);

        let numStartingTeamMembers = teamMembers.length;

        await lib.ambassadors.acceptJoinRequest(joinRequest.id);

        let joinRequests = await lib.ambassadors.listMemberJoinRequests(
          ambassadorTeam
        );

        assert.strictEqual(joinRequests.length, 0);

        let teamMembers = await lib.ambassadors.listTeamMembers(team.id);

        assert.strictEqual(teamMembers.length ,numStartingTeamMembers + 1);

      });

    });

  });

});

