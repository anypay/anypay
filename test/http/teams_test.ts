import {Server} from '../../servers/rest_api/server';

import { database } from '../../lib';

import * as assert from 'assert'

describe("Affiliate - HTTP API", () => {
  var server;

  before(async () => {
    await database.sync();

    server = await Server();
  });

  describe("Settings Up Your Team", () => {

    describe("creating a team", () => {

      it("POST /teams should make you the team lead given your account email")
    
    })

    describe("adding a team member", () => {

      it("GET /teams should list your teams and your pending team join requests")

      it("POST /teams/{uid}/members should request to add a member to your team")

      it("POST /teams/{uid}/members should should be pending until the team member approves")
    
    })

    describe("listing a team's memberm", () => {

      it("GET /teams/{uid}/members should list the members of a team")
    
    })

    describe("removing a team member", () => {

      it("DELETE /teams/{uid}/members/{member_id} should remove a member from the team")
    
    })

    describe("updating team name and images", () => {

      it("PUT /teams/{uid} should update the team name, icon_url, banner_url, website if you are the owner")

    })

  })

  describe("Viewing Team Stats", () => {

    describe("Listing Affiliated Merchants For a Team Member", () => {

      it("GET /teams/{uid}/merchants should show team merchants if you are part of the team") 

      it("GET /teams/{uid}/merchants should not show team merchants if you are not part of the team") 
    
    })

    describe("Listing A Team Member's Affiliate Rewards", () => {

      it("GET /teams/{uid}/members/{member_id}/rewards should list all rewards for your team member")
    
    })

    describe("Listing All Merchants In A Team", () => {

      it("GET /teams/{uid}/merchants should list all the current merchants for all current team members")
    
    })

    describe("Listing All Rewards For All Team Members", () => {

      it("GET /teams/{uid}/rewards should list all the rewards for all current team members and past members")
    
    })

  })

})

