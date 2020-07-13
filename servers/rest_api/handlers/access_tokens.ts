const log = require('winston');

module.exports.create = async (request, reply) => {

  let token = request.auth.credentials.accessToken;

  token.account = request.auth.credentials.account;

  return {

    uid: token.uid,

    account_id: token.account_id,

    email: request.auth.credentials.account.email

  };
}

