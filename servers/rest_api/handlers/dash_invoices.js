const DashInvoice = require("../../../lib/dash/invoice");

/**
 * @api {POST} /dash/invoices Generate a Dash Invoice
 * @apiName CreateDashInvoice
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
 *        currency: "DASH"
 *        amount: "0.00229"
 *        dollar_amount: "1.00"
 *        address: "XiXFFHo4Pg18cWw33SqQjAXwQcLz2Kqs82"
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
