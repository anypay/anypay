const PairToken = require('../../../lib/models/pair_token');
const AccessToken = require('../../../lib/models/access_token');
const log = require('winston');


/**
 * @api {POST} /pair_tokens Generate Pair Tokens for Device Authentication
 * @apiName CreatePairTokens
 * @apiGroup Pair Tokens
 *
 * @apiSuccess {Integer} id ID of pair token
 * @apiSuccess {Integer} account_id
 * @apiSuccess {Date} updatedAt Date and time when pair token was updated
 * @apiSuccess {Date} pairToken Date and time when pair token was created
 * @apiSuccess {String} uid Unique User ID pair token
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       id: 518
 *       account_id: 177
 *       updatedAt: 2017-11-14T18:15:25.330Z
 *       createdAt: 2017-11-14T18:15:25.330Z
 *       uid: cc3a80b2-00b8-4a06-8562-74497ff38a42
 *     }
 *
 * @apiError InternalError No pair token to match ID
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 InternalError
 *     {
 *       "error": "There was an internal error."
 *     }
 */

module.exports.create = (request, reply) => {
  PairToken.create({
    account_id: request.account_id
  })
    .then(pairToken => {
      reply(pairToken);
    })
    .catch(error => {
      reply({ error: error }).code(500);
    });
}

/**
 * @api {get} /pair_tokens Get Pair Tokens for Authentication of Device
 * @apiName ClaimPairTokens
 * @apiGroup Pair Tokens
 *
 * @apiParam {Number} uid Users unique ID.
 *
 * @apiSuccess {String} pairToken1 Firstname of the User.
 * @apiSuccess {String} pairToken2  Lastname of the User.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       device_name:,"Chromebook"
 *       access_token_id:,"asdfasdfasdf"
 *     }
 *
 * @apiError DeviceNameNotFound The name of the device was not found.
 * @apiError AccessTokenIDNotFound The name of the device was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "device_name required"
 *       "error": "access_token_id required"
 *     }
 @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error: failed to find pair token"
 *     }
 */

module.exports.claim = (request, reply) => {

  if (!request.payload.device_name) {
    return reply({ error: "device_name required" });
  }

  PairToken.findOne({ where: {
    uid: request.params.uid
  }})
  .then(pairToken => {
    var _accessToken;
    log.info('pair_token:claim', pairToken.toJSON());
    log.info("found pair token");

    if (pairToken.access_token_id) {
      return reply({ error: 'pair token already claimed' });
    }

    AccessToken.create({
      account_id: pairToken.account_id
    })
    .then(accessToken => {
      _accessToken = accessToken;
      return pairToken.updateAttributes({
        device_name: request.payload.device_name,
        access_token_id: _accessToken.id
      });
    })
    .then(res => {
      reply({
        pairToken: pairToken,
        accessToken: _accessToken
      });
    })
    .catch(error => {
      log.error(error.message);
      reply({ error: error.message });
    });
  })
  .catch(error => {
    log.error("failed to find pair token");
    reply({ error: error.message });
  });
}
