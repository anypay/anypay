
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn('ach_batches', 'batch_id', 'bank_batch_id')
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn('ach_batches', 'bank_batch_id', 'batch_id')
  }
};
