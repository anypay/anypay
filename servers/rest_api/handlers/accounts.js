const Account = require("../../../lib/models/account");
const bcrypt = require("bcrypt");

/**
 * @api {POST} /accounts Create a New Account
 * @apiName CreateNewAccount
 * @apiGroup Accounts
 *
 * @apiParam {String} email User's Login email
 * @apiParam {String} password User's Login password
 *
 * @apiSuccess {Integer} id
 * @apiSuccess {String} email User's Email Address
 * @apiSuccess {String} password_hash Hash of User's Password
 * @apiSuccess {Date} updatedAt Date the user's account was updated
 * @apiSuccess {Date} createdAt Date the user's account was created
 * @apiSuccess {String} uid Unique Identifier for User
 * @apiSuccess {String} dash_payout_address DASH Dash Payout Address
 * @apiSuccess {String} bitcoin_payout_address Bitcoin Payout Address
 * @apiSuccess {String} bitcoin_cash_address Bitcoin Cash Payout Address
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       id: 235
 *       email:	fake@example.com
 *       password_hash: $2a$10$Hm8LlEdB35benjDfd5xB.u3de3UrSYQTMIQYLBtPx5f0BBhTjx1HC
 *       updatedAt: 2017-11-14T19:11:43.960Z
 *       createdAt: 2017-11-14T19:11:43.960Z
 *       uid: a8744a26-32f4-4e42-b422-4ba46a6754e2
 *       dash_payout_address: null
 *       bitcoin_payout_address: null
 *       bitcoin_cash_address: null
 *     }
 *
 * @apiError 404 NoAddressesFound No address was found for user
 *
 */

module.exports.create = function (request, reply) => {
  bcrypt.hash(request.payload.password, 10, (error, hash) => {
    Account.create({
      email: request.payload.email,
      password_hash: hash
    })
      .then(account => {
        reply(account);
      })
      .catch(error => {
        reply({ error: error }).code(500);
      });
  });
}
