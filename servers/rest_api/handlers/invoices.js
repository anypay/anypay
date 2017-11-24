const Invoice = require('../../../lib/models/invoice');

/**
 * @api {get} /invoices/{invoice_id} Show Invoice
 * @apiName GetInvoice
 * @apiGroup Invoices
 *
 * @apiParam {Number} invoice_id Unique invoice ID
 *
 * @apiError 404 NoInvoiceFound No invoice was found for uid
 * @apiError 400 AccountNotFound No Account was found with access_token provided
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
 *
 * @apiSuccessExample {json} Success-Response:
 *
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
 */

module.exports.show = function(request, reply) {
   Invoice.findOne({
     where: {
       uid: request.params.invoice_id
     }
   })
     .then(invoice => {
       if (invoice) {
         reply(invoice);
       } else {
         reply().code(404);
       }
     })
     .catch(error => reply({ error }).code(500));
 }

 /**
  * @api {GET} /invoices List Invoices
  * @apiName ListInvoices
  * @apiGroup Invoices
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
  *
  * @apiSuccessExample {json} Success-Response:
  *
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
  */


module.exports.index = (request, reply) => {

  Invoice.findAll({ where: {
    account_id: request.auth.credentials.accessToken.account_id
  }})
  .then(invoices => {
    reply({ invoices: invoices });
  });
}
