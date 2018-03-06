const bcrypt = require('bcrypt');
const Account = require('./models/account');

function hash(password) {
  return new Promise((resolve, reject) => {

    bcrypt.hash(password, 10, (error, hash) => {
      if (error) { return reject(error) }
      resolve(hash);
    })
  });
}


async function resetPasswordByEmail(email, newPassword) {

  let account = await Account.findOne({
    where: { email: email }
  })

  if (account) {

    let result = await resetPassword(account.id, newPassword);

    return result;
    
  } else {
    throw new Error(`account not found with email: ${email}`);
  }
}

async function resetPassword(accountId, newPassword) {

  let passwordHash = await hash(newPassword);

  await Account.update({
    password_hash: passwordHash
  }, {
    where: {
      id: accountId
    }
  })

  return true;
}

module.exports.resetPasswordById = resetPassword;
module.exports.resetPasswordByEmail = resetPasswordByEmail;

