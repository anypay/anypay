const Account = require('../../../lib/models/account');;
const bcrypt = require('bcrypt');
const log = require('winston');
const Slack = require('../../../lib/slack/notifier');
const Boom = require('boom');

function hash(password) {
  return new Promise((resolve, reject) => {

    bcrypt.hash(password, 10, (error, hash) => {
      if (error) { return reject(error) }
      resolve(hash);
    })
  });
}

module.exports.create = async (request, reply) => {
  let email = request.payload.email;

  log.info('create account with email', email);

  let passwordHash = await hash(request.payload.password);

  try {
    let account = await Account.create({
      email: request.payload.email,
      password_hash: passwordHash
    });

    Slack.notify(`account:created | ${account.email}`);

    return account;

  } catch(error) {

    log.error(`account ${email} already registered`);

    return Boom.badRequest(
      new Error(`account ${email} already registered`)
    );
  }
}


module.exports.show = async (request, reply) => {
  let accountId = request.auth.credentials.accessToken.account_id;
  var account = await Account.findOne({ where: { id: accountId } })

  return account;
}
