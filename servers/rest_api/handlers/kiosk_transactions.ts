
import { Request, ResponseToolkit } from 'hapi';

import * as Boom from 'boom';

import { models } from '../../../lib';

export async function index(req, h: ResponseToolkit) {

  try {

    let kiosk = await models.VendingMachine.findOne({ 

      where: {

        id: req.params.kiosk_id
          
      }

    });

    if (!kiosk || kiosk.account_id !== req.account.id) {

      throw new Error('kiosk does not belong to account');

    }

    let kiosk_transactions = await models.VendingTransaction.findAll({

      where: {

        vending_machine_id: req.params.kiosk_id

      }

    });

    return { kiosk_transactions };

  } catch(error) {

    console.log(error);

    return Boom.badRequest(error.message)

  }

}

