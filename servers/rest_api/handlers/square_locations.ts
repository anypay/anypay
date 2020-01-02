
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

    let locations = await squareClient.listLocations();

    return locations;

  } catch(error) {

    return Boom.badRequest(error.message);

  }

}

export async function show (req, h) {

  let squareClient = await getClient(req.account.id);

  try {

    
    let location = await squareClient.getLocation(req.params.location_id);

    return location;

  } catch(error) {

    return Boom.badRequest(error.message);

  }

}

