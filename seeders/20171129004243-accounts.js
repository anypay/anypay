'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
	  /*
      return queryInterface.bulkInsert('accounts', [{
        "id":41, 
"email":"brett.golabs@gmail.com", 
"uid":41, 
"password_hash":"passwordHash", 
"dash_payout_address":"payoutaddress", 
"createdAt":"2017-11-29T00:30:14.458Z", 
"updatedAt":"2017-11-29T00:30:14.458Z"
      }], {});
	  */
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
