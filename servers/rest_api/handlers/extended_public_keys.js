const sequelize = require('../../../lib/database');
const ExtendedPublicKey = require('../../../lib/models/extended_public_key');
const Joi = require('joi');

module.exports.index = function(request, reply) {
  console.log('index', request.account_id);

  console.log(ExtendedPublicKey.findOne);

  ExtendedPublicKey.findOne({ where: {
    account_id: request.account_id
  }})
  .then(xpubkey => {
    console.log("got xpubkey", xpubkey);
    reply({xpubkey: xpubkey})
  })
  .catch(error => {
    console.error("caught error");
    reply({error: erorr.message});
  });
}

module.exports.create = function(request, reply) {

  ExtendedPublicKey.findOne({ where: {
    account_id: request.account_id
  }})
  .then(xpubkey => {
    if (!xpubkey) {
      return ExtendedPublicKey.create({
        account_id: request.account_id,
        xpubkey: request.payload.xpubkey,
        nonce: 0
      })
      .then(xpubkey => reply({xpubkey: xpubkey}))
    } else {
      return xpubkey.updateAttributes({
        xpubkey: request.payload.xpubkey
      })
      .then(xpubkey => reply({xpubkey: xpubkey}))
    }
  })
  .catch(error => {
    reply({error: erorr.message});
  });
}

module.exports.ExtendedPublicKey = Joi.object({
  xpubkey: Joi.string().required(),
}).label('ExtendedPublicKey');
