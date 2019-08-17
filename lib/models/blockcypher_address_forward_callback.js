
module.exports = (sequelize, Sequelize) => {

  var blockcypher_forward_callback = sequelize.define('blockcypher_address_forward_callback', {
    value: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    input_address: {
      type: Sequelize.STRING,
      allowNull: false
    },
    destination: {
      type: Sequelize.STRING,
      allowNull: false
    },
    input_transaction_hash: {
      type: Sequelize.STRING,
      allowNull: false
    },
    transaction_hash: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return blockcypher_forward_callback;
};
