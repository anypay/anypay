
import * as assert from 'assert'

describe("Affiliate - Typescript Library", () => {

  describe("Settings Up Your Team", () => {

    it("#createTeam should make you the team lead given your account email")
    it("#addTeamMember should request to add a member to your team")
    it("#addTeamMember should be pending until the team member approves the request")
    it("#listTeamMembers should list both pending and confirmed team members")
    it("#removeTeamMember should mark a given team member as removed, no longer show up in members list")

  })

  describe("Viewing Team Stats", () => {

    it("#listTeamMemberMerchants should show the affiliated merchants for a team member")
    it("#getTeamMemberAwards should show the awards earned by a team member as an affiliate")
    it("#listTeamMerchants should should return all the merchants for an entire team")
    it("#listTeamStats should return the number of merchants and awards given")
    it("#listTeamRewards should list all the rewards earned by all the members of the team")

  })

  describe("Sudo Managing Teams", () => {
  
    it("#listTeams should return a list of all teams with")
  
  })

})

