
module.exports = function(sequelize, Sequelize) {
  const PasswordReset = sequelize.define('password_reset', {
    uid: {   
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    claimed: {
      type: Sequelize.BOOLEAN
    },
    email: {
      type: Sequelize.STRING,
      validate: {
        isEmail: true
      }
    }
  }, {
    tableName: 'password_resets'
    // options
  });

  return PasswordReset;

} 

