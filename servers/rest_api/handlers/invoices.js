const Invoice = require("../../../lib/models/invoice");

module.exports.index = async (request, reply) => {
  var invoice = await Invoice.findAll({
    where: {
      account_id: request.auth.credentials.accessToken.account_id
    }
  });
};

module.exports.show = async function(request, reply) {
  let invoice = await Invoice.findOne({
    where: {
      uid: request.params.invoice_id
    }
  });

  if (!invoice) {
    throw new Error('invoice not found')
  }

  return invoice;
}
