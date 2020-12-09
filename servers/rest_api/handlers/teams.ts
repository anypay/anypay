
import * as Boom from 'boom'
import { log } from '../../../lib'

import * as teams from '../../../lib/teams'

export async function create(req, h) {
  log.info('createteam', req.payload)

  try {

    let team = await teams.create(req.account.id, req.payload.data.attributes)

    return {
      data: {
        type: "teams",
        id: team.id,
        attributes: team.toJSON()
      }
    }

  } catch(error) {

    log.error(error.message)

    return {
      errors: [error.message]
    }

  }

}

export async function list(req, h) {

  try {

    let _teams = await teams.list(req.account.id)

    return {
      data: _teams.map(team => {
        return {
          type: "teams",
          id: team.id,
          attributes: team.toJSON()
        }
      })
    }

  } catch(error) {

    log.error(error.message)

    return Boom.badRequest(error.message)

  }

}

export async function addMember(req, h) {

  try {

    let member = await teams.addMember(req.params.team_id, req.payload)

    return { member }

  } catch(error) {

    log.error(error.message)

    return Boom.badRequest(error.message)

  }

}

export async function listMembers(req, h) {

  try {

    let members = await teams.listMembers(req.params.team_id)

    return { members }

  } catch(error) {

    log.error(error.message)

    return Boom.badRequest(error.message)

  }

}

export async function removeMember(req, h) {

  try {

    let member = await teams.removeMember(req.params.team_id, req.params.member_id)

    return { member }

  } catch(error) {

    log.error(error.message)

    return Boom.badRequest(error.message)

  }

}

export async function updateTeam(req, h) {

  try {

    let team = await teams.update(req.params.team_id, req.payload)

    return { team }

  } catch(error) {

    log.error(error.message)

    return Boom.badRequest(error.message)

  }

}

export async function listTeamMemberRewards(req, h) {

  try {

    let rewards = await teams.listTeamMemberRewards(req.params.team_id)

    return { rewards }

  } catch(error) {

    log.error(error.message)

    return Boom.badRequest(error.message)

  }

}

export async function listTeamMerchants(req, h) {

  try {

    let merchants = await teams.listTeamMerchants(req.params.team_id)

    return { merchants }

  } catch(error) {

    log.error(error.message)

    return Boom.badRequest(error.message)

  }

}

export async function listTeamRewards(req, h) {

  try {

    let rewards = await teams.listTeamRewards(req.params.team_id)

    return { rewards }

  } catch(error) {

    log.error(error.message)

    return Boom.badRequest(error.message)

  }

}

