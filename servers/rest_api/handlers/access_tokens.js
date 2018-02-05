const log = require('winston');

module.exports.create = async (request, reply) => {
  log.info('in create access token controller');
  return request.auth.credentials.accessToken;
}

