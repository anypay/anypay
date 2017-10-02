'use strict';
const AccessToken = require("../lib/models/access_token");

module.exports = {
  up: function (queryInterface, Sequelize) {

    return new Promise((resolve, reject) => {

      queryInterface.describeTable('pair_tokens').then(description => {

        if (description.access_token_id) {
          resolve();
        } else {
          queryInterface.addColumn('pair_tokens', 'access_token_id', {
            type: Sequelize.INTEGER
          })
          .then(resolve)
        }
      })
      .catch(error => {

        console.log("NO PAIR TOKENS");

        queryInterface.createTable('pair_tokens', {
          id :{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          uid: {
            type: Sequelize.STRING
          },
          device_name: {
            type: Sequelize.STRING
          },
          access_token_id: {
            type: Sequelize.INTEGER/*,
            references: {
              model: AccessToken,
              key: 'id'
            }*/
          }
        }, {})
        .then(resolve)
        .catch(error => {
          console.log("ERROR", error); 
        })
      });
    });
  },

  down: function (queryInterface, Sequelize) {
    return new Promise((resolve, reject) => {
      queryInterface.describeTable('pair_tokens').then(description => {
        queryInterface.removeColumn('pair_tokens', 'access_token_id')
          .then(resolve)
      })
      .catch(error => {
        resolve()
      })
    });
  }
};

