const PairToken = require('../../../lib/models/pair_token');
const AccessToken = require('../../../lib/models/access_token');
const log = require('winston');

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

