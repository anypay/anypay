'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('router_transactions', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            input_txid: {
                type: Sequelize.STRING,
                allowNull: false
            },
            input_currency: {
                type: Sequelize.STRING
            },
            input_amount: {
                type: Sequelize.STRING
            },
            input_address: {
                type: Sequelize.STRING
            },
            output_txid: {
                type: Sequelize.STRING
            },
            output_currency: {
                type: Sequelize.STRING,
                allowNull: false
            },
            output_amount: {
                type: Sequelize.STRING,
                allowNull: false
            },
            output_address: {
                type: Sequelize.STRING,
                allowNull: false
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('router_transactions');
    }
};
//# sourceMappingURL=20190706193849-create-router-transaction.js.map