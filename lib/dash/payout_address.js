const Account = require('../models/account');
const bitcore = require('bitcore-lib-dash');

/**
 * @api {POST} /payout_address Update Dash Payout Address
 * @apiName UpdateDashAddress
 * @apiGroup Addresses
 *
 * @apiParam {String} address Dash Payout Address
 *
 * @apiSuccess {String} newAddress New Dash Payout Address
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       DASH: "XatPMnCbQR8EHy2Mg9b67jjQhLbuLRtwBR"
 *     }
 *
 * @apiError 404 NoAddressesFound No address was found for user
 */

module.exports.save = (account_id, address) => {

  if (bitcore.Address.isValid(address)) {

    return Account.update({ dash_payout_address: address }, {
      where: { id: account_id }
    });

  } else {
    console.log('invalid dash address', address);

    return Promise.reject(new Error('invalid dash address'));
  }
}
