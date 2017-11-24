const BitcoinInvoice = require("../../../lib/bitcoin/invoice");

/**
 * @api {POST} /bitcoin/invoices Generate a Bitcoin Invoice
 * @apiName CreateBitcoinInvoice
 * @apiGroup Invoices
 *
 * @apiParam {Decimal} dollarAmount Amount of Dollars Being Invoiced
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
 * @apiSuccess {Date} paidAt reports when this invoice was paid
 * @apiSuccess {Date} createdAt when the invoice was created
 * @apiSuccess {Date} updatedAt when the invoice was updated
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id":803,
 *       "uid":"e9bf0ee8-6f96-4e3f-a44f-5a8d2051b4f1",
 *       "currency":"BTC",
 *       "amount":"0.00015",
 *       "dollar_amount":"1.00",
 *       "address":"19VALxfm14RGLJSa5y3r6PgNvLagseagcF",
 *       "account_id":177,
 *       "access_token":null,
 *       "hash":null,
 *       "status":"unpaid",
 *       "settledAt":null,
 *       "paidAt":null,
 *       "createdAt":"2017-11-13T22:21:58.828Z",
 *       "updatedAt":"2017-11-13T22:21:58.828Z"
 *     }
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

  BitcoinInvoice.generate(dollarAmount, accountId).then(invoice => {
    reply(invoice);
  })
  .catch(error => {
    reply({ error: error.message }).code(500);
  });
}
