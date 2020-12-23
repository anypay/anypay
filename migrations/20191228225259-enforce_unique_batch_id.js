'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
      `ALTER TABLE ach_batches ADD CONSTRAINT unique_batch_id  UNIQUE (batch_id);`
    );
  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.sequelize.query(
      `ALTER TABLE ach_batches DROP CONSTRAINT unique_batch_id;`
    );

  }
};
