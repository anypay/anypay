const sequelize = require('../../../lib/database');
const ExtendedPublicKey = require('../../../lib/models/extended_public_key');

function ReplyError(error) {
  console.error(error.message);
  reply({error: erorr.message});
}

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
  console.log('index', request.account_id);

  console.log(ExtendedPublicKey.findOne);

  ExtendedPublicKey.findOne({ where: {
    account_id: request.account_id
  }})
  .then(xpubkey => {
    console.log("got xpubkey", xpubkey);
    reply({xpubkey: xpubkey})
  })
  .catch(error => {
    console.error("caught error");
    reply({error: erorr.message});
  });
}

module.exports.create = function(request, reply) {

  ExtendedPublicKey.findOne({ where: {
    account_id: request.account_id
  }})
  .then(xpubkey => {
    if (!xpubkey) {
      return ExtendedPublicKey.create({
        account_id: request.account_id,
        xpubkey: request.payload.xpubkey,
        nonce: 0
      })
      .then(xpubkey => reply({xpubkey: xpubkey}))
    } else {
      return xpubkey.updateAttributes({
        xpubkey: request.payload.xpubkey
      })
      .then(xpubkey => reply({xpubkey: xpubkey}))
    }
  })
  .catch(error => {
    reply({error: erorr.message});
  });
}
