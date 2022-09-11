const uuid = require('uuid');
import * as Joi from 'joi'

module.exports = function(sequelize, Sequelize) {

  const Account = require('./account')(sequelize, Sequelize);

  const AccessToken = sequelize.define('access_token', {
    uid: Sequelize.STRING,
    app_id: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    account_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Account,
        key: 'id'
      }
    }
  }, {
    hooks: {
      beforeCreate: (accessToken, options) => {
        accessToken.uid = uuid.v4();
      }
    }
  });

  return AccessToken;
}

module.exports.Response = Joi.object({
  uid: Joi.string().required(),
  account_id: Joi.number().integer().required(),
}).label("AccessToken");
