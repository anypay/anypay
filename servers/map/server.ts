
require('dotenv').config();

const Hapi = require('hapi');

import * as Boom from 'boom';

import { log, models, tipjar } from '../../lib';

export async function attachMerchantMapRoutes(server) {

  server.route({

    method: 'GET',
    path: '/merchants-list',

    handler: async (req, h) => {

      return [{

        email: 'murphys@anypay.global',

        account_id: 499

      }, {
      
        email: 'info@mnpastry.com',

        account_id: 455

      }, {
      
        email: 'freshpress@anypay.global',

        account_id: 176

      }]

    }

  });

  interface MerchantInfo {
    business_address: string;
    business_name: string;
    tipjar_address: string;
    latitude: number;
    longitude: number;
    cash_back_enabled: boolean;
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

    console.log("get merchant info", accountId); 

    let account = await models.Account.findOne({where: {
      stub: accountId
    }})

    if (!account) {

      account = await models.Account.findOne({where: {

        id: parseInt(accountId)
      }})

    }

    if (!account) {
      throw new Error('no account found');
    }

    let cashbackMerchant = await models.CashbackMerchant.findOne({ where: {

      account_id: account.id

    }});

    let jar = await tipjar.getTipJar(account.id, 'BCH');

    return {
      business_name: account.business_name,
      business_address: account.business_address,
      latitude: parseFloat(account.latitude),
      longitude: parseFloat(account.longitude),
      cash_back_enabled: cashbackMerchant.enabled,
      tipjar_address: jar.address,
      image_url: account.image_url,
      account_id: account.id,
      denomination: account.denomination
    }

  }

}

