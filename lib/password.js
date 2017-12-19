const Account = require('./models/account');
const bcrypt = require('bcrypt');
const log = require('winston');

module.exports.reset = async (email, password) => {
  return new Promise((resolve, reject) => {

    bcrypt.hash(password, 10, async (error, hash) => {

      if (error) {
        log.error("error genenerating password hash", error.messge);
        return reject(error);
      }

      let account = await Account.update({
        password_hash: hash
      }, {
        where: {
          email: email
        }
      })

      log.info(`updated password for email:${account.email} id:${account.id}`);

    });

  });

}

module.exports.verify = async (password, passwordHash) => {

  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (error, res) => {
      if (res) {
        resolve(true);
      } else {
        reject(new Error("invalid email or password"));
      }
    });
  });

}

