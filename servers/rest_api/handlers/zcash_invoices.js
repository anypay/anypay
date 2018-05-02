const ZcashInvoice = require("../../../lib/zcash/invoice");

module.exports.create = function(request, h) {
  const dollarAmount = request.payload.amount;
  const accountId = request.auth.credentials.accessToken.account_id;
  const encrypted = request.payload.encrypted;

  return ZcashInvoice.generate({
    dollar_amount: dollarAmount,
    account_id: accountId,
    encrypted: encrypted
  });
}
