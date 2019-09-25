import { models } from '../../../lib';

/*

  All meant to be only for sudo users

*/

export async function index(request) {

  let limit = parseInt(request.query.limit) || 100;
  let offset = parseInt(request.query.offset) || 0;

  models.PaymentForward.findAll({ offset, limit });

}

export async function show(request) {

  return models.PaymentForward.findOne({ where: { id: request.params.id }});

}

