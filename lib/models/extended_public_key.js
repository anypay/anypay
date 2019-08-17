
module.exports = function(sequelize, Sequelize) {
  const ExtendedPublicKey = sequelize.define('extended_public_key', {
    xpubkey: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    nonce: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    currency: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    account_id: Sequelize.INTEGER
  });

  return ExtendedPublicKey

}

