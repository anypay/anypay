const bcrypt = require("bcrypt");
const Account = require("./models/account");
const AccessToken = require("./models/access_token");

module.exports.withEmailPassword = (email, password) => {
  return new Promise((resolve, reject) => {
    Account.findOne({
      where: {
        email: email.toLowerCase()
      }
    }).then(account => {

      if (!account) {
        return reject(new Error(`account not found: ${email}`));
      }

      bcrypt.compare(password.toLowerCase(), account.password_hash, (error, res) => {
        if (res) {
          return AccessToken.create({ account_id: account.id })
            .then(resolve)
            .catch(reject);
        } else {
          reject(new Error("invalid email or password"));
        }
      });
    });
  });
};
