
import * as Hapi from 'hapi';

import { Request } from 'hapi';

import { models, ambassadors } from '../../../lib';

import * as _ from 'lodash'; 
import * as Boom from 'boom';

import { Op } from 'sequelize';

export async function create(req: Request) {

  let account = await models.Account.findOne({ where: { id: req.payload.account_id }});

  if (!account) {
    return Boom.badRequest('account not found');  
  }

  let ambassador = await models.Ambassador.create(req.payload);

  return { ambassador };

}

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

      let account = await models.Account.findOne({
        where: { id: ambassador.account_id }
      });

      var parent;

      if (ambassador.parent_id) {

        parent = await models.Ambassador.findOne({ where: {
          id: ambassador.parent_id
        }});
      }

      return {
        ambassador, rewards, account, parent
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
      },

      order: [["createdAt", "desc"]]
    });

    var parent;

    if (ambassador.parent_id) {

      parent = await models.Ambassador.findOne({ where: {
        id: ambassador.parent_id
      }});
    }

    let account = await models.Account.findOne({
      where: { id: ambassador.account_id }
    });

    return { ambassador, rewards, account, parent };

  } catch(error) {

    return Boom.badRequest(error.message);

  }

};

