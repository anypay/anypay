const _ = require('underscore');
const password = require("../../../lib/password")
const PasswordReset = require("../../../lib/models/password_resets");

module.exports.reset = async function(request, reply) {

  try {

    await password.sendPasswordResetEmail(request.payload.email);

    return { success: true };

  } catch(error) {

    return { success: false, error: error.message };
  }
}

module.exports.claim = async function(request, reply) {

  try {

    let passwordReset = await PasswordReset.findOne({ where:
      { uid: request.params.uid }
    })

    if (!passwordReset) {
      return { success: false }
    }

    await password.resetPasswordByEmail(passwordReset.email, request.payload.password);

    return { success: true };

  } catch(error) {

    return { success: false, error: error.message };
  }
}
