
import * as Boom from 'boom';

import { square } from '../../../lib';

export async function index (req, h) {

  try {

    let orders = square.listOrders(req.account.id, req.params.location_id)

    return orders;

  } catch(error) {

    return Boom.badRequest(error.message);

  }

}

export async function show (req, h) {

  try {

    let order = await square.getOrder(req.account.id, req.params.order_id);

    return order;

  } catch(error) {

    return Boom.badRequest(error.message);

  }

}

