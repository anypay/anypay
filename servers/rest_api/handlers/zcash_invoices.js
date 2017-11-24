const ZcashInvoice = require("../../../lib/zcash/invoice");


/**
 * @api {POST} /zcash/invoices Generate a ZCash Invoice
 * @apiName CreateZCashInvoice
 * @apiGroup Invoices
 *
 * @apiParam {Decimal} amount The amount of dollars requested in invoice
 *
 * @apiSuccess {String} uid the invoice id
 * @apiSuccess {String} currency the type of currency being invoiced
 * @apiSuccess {Decimal} amount the amount of currency being invoiced
 * @apiSuccess {Decimal} dollar_amount the amount of dollars being invoiced
 * @apiSuccess {String} address the crypto address the customer pays in the invoice
 * @apiSuccess {Integer} account_id account ID
 * @apiSuccess {String} access_token access token
 * @apiSuccess {String} hash a hash of this invoice data
 * @apiSuccess {String} status reports if the invoice has been paid or not
 * @apiSuccess {Date} settledAt reports when the merchant is paid
 * @apiSuccess {Date} paidAt reports when this invoice was paidAt
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *        uid: "2eec92a2-74a6-483c-b61c-fca16904979b"
 *        currency: "ZEC"
 *        amount: "0.00229"
 *        dollar_amount: "1.00"
 *        address: "tiXFFHo4Pg18cWw33SqQjAXwQcLz2Kqs82"
 *        account_id: 177
 *        access_token: null
 *        hash: null
 *        status: "unpaid"
 *        settledAt: null
 *        paidAt: null
 *
 * @apiError No dollar amount found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "amount required (dollars)"
 *     }
 */

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
