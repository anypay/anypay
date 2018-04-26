const _ = require('underscore');
const password = require("../../../lib/password")

module.exports.reset = async function(request, reply) {

  try {

    await password.sendPasswordResetEmail(request.payload.email);

    return { success: true };

  } catch(error) {

    return { success: false, error: error.message };
  }
}
