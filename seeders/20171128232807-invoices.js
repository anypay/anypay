'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('invoices', [   
    {
      "id": 635,
      "uid": "56bc0d99-68e3-43ec-8471-dcda519497fb",
      "currency": "DASH",
      "amount": "0.00377",
      "dollar_amount": "1.01",
      "address": "XjmgC5vyt5kb4HNAiiYhjdjpn6a1qq7ScR",
      "account_id": 41,
      "access_token": null,
      "hash": null,
      "status": "paid",
      "settledAt": null,
      "paidAt": "2017-11-03T01:10:29.975Z",
      "createdAt": "2017-11-03T01:10:22.751Z",
      "updatedAt": "2017-11-03T01:10:29.976Z"
    }], {});
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
