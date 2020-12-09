
import { models } from './models'
import { log } from './logger'

export async function listTeamMembers(team_id: number) {

}

export async function list(ownerAccountId: number) {

  let teams = await models.Team.findAll({
    where: { ownerAccountId }
  })

  return teams



}

export async function create(ownerAccountId: number, params: any) {

  log.info('createnewteam', { ownerAccountId, params })

  let [team, isNew] = await models.Team.findOrCreate({
    where: {
      name: params.name
    },
    defaults: Object.assign({ ownerAccountId }, params)
   })

  if (!isNew) {
    throw new Error('team already exists with that name')
  }

  return team

}

export async function addMember(team_id: number, member: any) {

}

export async function removeMember(team_id: number, member_id: any) {

}

export async function listMembers(team_id: number) {

}

export async function update(team_id: number, params: any) {

}

export async function listTeamRewards(team_id: number) {

}

export async function listTeamMerchants(team_id: number) {

}

export async function listTeamMemberRewards(team_id: number) {

}

