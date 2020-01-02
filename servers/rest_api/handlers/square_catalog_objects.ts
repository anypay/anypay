
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

    let catalog = await squareClient.listCatalog();

    return catalog;

  } catch(error) {

    return Boom.badRequest(error.message);

  }

}

export async function show (req, h) {

  let squareClient = await getClient(req.account.id);

  try {

    
    let catalogObject = await squareClient.getCatalogObject(req.params.object_id);

    return catalogObject;

  } catch(error) {

    return Boom.badRequest(error.message);

  }

}

