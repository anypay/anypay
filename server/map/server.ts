
require('dotenv').config();

const Hapi = require('hapi');

import * as Boom from 'boom';

import { log, models } from '../../lib';

export async function attachMerchantMapRoutes(server) {

  interface MerchantInfo {
    business_address: string;
    business_name: string;
    latitude: number;
    longitude: number;
    image_url: boolean;
    account_id: number;
    denomination: string;
  }

  server.route({

    method: 'GET',
    path: '/merchants/{account_id}',

    handler: async (req, h) => {

      try {

        return getMerchantInfo(req.params.account_id);

      } catch(error) {

        return Boom.badRequest(error.message);

      }
      
    }

  });

  async function getMerchantInfo(accountId: any): Promise<MerchantInfo> {

    let account = await models.Account.findOne({where: {
      stub: accountId
    }})

    if (!account) {

      account = await models.Account.findOne({where: {

        id: parseInt(accountId)
      }})

    }

    if (!account) {
      throw new Error(`no account found for id ${accountId}`);
    }

    return {
      business_name: account.business_name,
      business_address: account.business_address,
      latitude: parseFloat(account.latitude),
      longitude: parseFloat(account.longitude),
      image_url: account.image_url,
      account_id: account.id,
      denomination: account.denomination
    }

  }

}

