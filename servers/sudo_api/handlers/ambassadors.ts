
import * as Hapi from 'hapi';

import { Request } from 'hapi';

import { models, ambassadors } from '../../../lib';

import * as _ from 'lodash';

import * as Boom from 'boom';

import { Op } from 'sequelize';

export async function index(req: Request) {

  try {

    let ambassadors = await models.Ambassador.findAll({
      includes: [{
        model: models.Account,
        as: 'merchants'
      }, {
        model: models.AmbassadorReward,
        as: 'ambassador'
      }]
    });

    let merchants = await models.Account.findAll({

      where: {

        ambassador_id: {
          
          [Op.in]: ambassadors.map(a => a.id)

        }

      }

    });

    ambassadors = await Promise.all(ambassadors.map(async ambassador => {

      let rewards = await models.AmbassadorReward.findAll({
        where: { ambassador_id: ambassador.id }
      });

      return {
        ambassador, rewards
      }
    
    }))

    return { ambassadors, merchants };

  } catch(error) {

    return Boom.badRequest(error.message);

  }

};

export async function show(req: Request) {

  try {

    let ambassador = await models.Ambassador.findOne({
      where: {
        id: req.params.id
      },
      includes: [{
        model: models.Account,
        as: 'merchants'
      }, {
        model: models.AmbassadorReward,
        as: 'rewards'
      }]
    });

    let rewards = await models.AmbassadorReward.findAll({
      where: {
        ambassador_id: req.params.id
      }
    });

    return { ambassador, rewards };

  } catch(error) {

    return Boom.badRequest(error.message);

  }

};

