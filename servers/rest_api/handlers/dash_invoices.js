const DashInvoice = require("../../../lib/dash/invoice");

module.exports.create = function(request, reply) {

  if (!request.payload || !request.payload.amount) {
    reply({ error: 'amount required (dollars)' });
    return;
  }

  let dollarAmount = request.payload.amount;
  let accountId = request.auth.credentials.accessToken.account_id;

  console.log('dash invoice generate!!!')

  DashInvoice.generate(dollarAmount, accountId).then(invoice => {
    reply(invoice);
  })
  .catch(error => {
    reply({ error: error.message }).code(500);
  });
}

