const sequelize = require('../../../lib/database');



/**
 * @api {GET} /balances Get Balances
 * @apiName Get Balances
 * @apiGroup Balances
 *
 * @apiParam {String} address Dash Payout Address
 *
 * @apiSuccess {String} newAddress New Dash Payout Address
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       DASH: 14.512 DASH
 *     }
 *
 * @apiError 404 NoAddressesFound No address was found for user
 */

module.exports.index = function(request, reply) {
  let accountId = 14;

  sequelize.query(`select sum(amount) as balance
      from invoices
      where "settledAt" is null
      and status = 'paid'
      and account_id = ${accountId}`, {
    type: sequelize.QueryTypes.SELECT
  })
  .then(results => {

    if (results[0]) {
      reply({
        dash: parseFloat(results[0].balance)
      });
    } else {
      reply().code(500);
    }
  })
  .catch(error => {
    reply({ error: error.message }).code(500);
  });
}
