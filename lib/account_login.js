const bcrypt = require("bcrypt");
const Account = require("./models/account");
const AccessToken = require("./models/access_token");
const log = require("winston");

async function bcryptCompare(password, hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (error, res) => {
      if (res) {
        resolve();
      } else {
        reject(new Error("invalid email or password"));
      }
    })
  })
}

module.exports.withEmailPassword = async (email, password) => {
  log.info("lookup email for login", email);


  var account = await Account.findOne({
    where: {
      email: email
    }
  });

  if (!account) {
    log.info('no account found for email', email);
    throw new Error('account with email not found');
  }

  log.info('found account with email', account.toJSON());

  await bcryptCompare(password, account.password_hash);
  
  log.info(`password for email ${email} is correct`);

  var token = await AccessToken.create({ account_id: account.id })

  if (!token) {
    throw new Error('failed to create access token');
  }

  return token;
};
