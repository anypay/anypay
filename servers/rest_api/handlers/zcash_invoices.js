const ZcashInvoice = require("../../../lib/zcash/invoice");

module.exports.create = function(request, reply) {
  let dollarAmount = request.payload.amount;
  let accountId = request.auth.credentials.accessToken.account_id;
  let encrypted = request.payload.encrypted;


  ZcashInvoice.generate({
    dollar_amount: dollarAmount,
    account_id: accountId,
    encrypted: encrypted
  })
  .then(invoice => {
    reply(invoice)
  })
  .catch(error => {
    reply({ error: error.message }).code(500);
  });
}

