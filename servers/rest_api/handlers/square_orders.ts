
import * as Boom from 'boom';

import { models, square } from '../../../lib';

async function getClient(accountId) {

  let squareCreds = await models.SquareOauthCredentials.findOne({ where: {

    account_id: accountId

  }});

  let squareClient = new square.SquareOauthClient(squareCreds.access_token);

  return squareClient;

}

export async function index (req, h) {

  let squareClient = await getClient(req.account.id);

  try {

    let orders = await squareClient.listOrders(req.params.location_id);

    return orders;

  } catch(error) {

    return Boom.badRequest(error.message);

  }

}

export async function show (req, h) {

  let squareClient = await getClient(req.account.id);

  try {

    
    let order = await squareClient.getOrder(req.params.order_id);

    return order;

  } catch(error) {

    return Boom.badRequest(error.message);

  }

}

