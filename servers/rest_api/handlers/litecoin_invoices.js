const LitecoinInvoice = require("../../../lib/litecoin/invoice");
const log = require('winston');

module.exports.create = function(request, reply) {
  let dollarAmount = request.payload.amount;
  let accountId = request.auth.credentials.accessToken.account_id;

  log.info('litecoin:invoice:generate', {
    amount: dollarAmount,
    account_id: accountId
  });

  LitecoinInvoice.generate(dollarAmount, accountId).then(invoice => {
    reply(invoice);
  })
  .catch(error => {
    reply({ error: error.message }).code(500);
  });
}

