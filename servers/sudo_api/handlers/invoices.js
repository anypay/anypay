const Invoice = require('../../../lib/models/invoice');

const log = require('winston');

module.exports.sudoIndex = async (request, reply) => {

  log.info(`controller:invoices,action:index`, request.query);

  let where = {}

  if (request.query.currency) {
    where['currency'] = request.query.currency;
  }

  if (request.query.denomination) {
    where['denomination'] = request.query.denomination;
  }

  if (request.query.account_id) {
    where['account_id'] = request.query.account_id;
  }

  if (request.query.status) {
    where['status'] = request.query.status;
  }

  var invoices = await Invoice.findAll({

    where,

    order: [
      request.query.order || ['createdAt', 'DESC']
    ],

    offset: parseInt(request.query.offset) || 0,

    limit: parseInt(request.query.limit) || 100

  });

  return { invoices };

};

