
module.exports.create = async (request, reply) => {
  return request.auth.credentials.accessToken;
}

