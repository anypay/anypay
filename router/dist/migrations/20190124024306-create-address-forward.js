'use strict';
module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('address_forwards', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            uid: {
                type: Sequelize.STRING,
                allowNull: false
            },
            token: {
                type: Sequelize.STRING,
                allowNull: true
            },
            destination: {
                type: Sequelize.STRING,
                allowNull: false
            },
            input_address: {
                type: Sequelize.STRING,
                allowNull: false
            },
            process_fee_satoshis: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            process_fees_address: {
                type: Sequelize.STRING,
                allowNull: true
            },
            process_fees_percent: {
                type: Sequelize.DECIMAL,
                allowNull: true
            },
            callback_url: {
                type: Sequelize.STRING,
                allowNull: true
            },
            enable_confirmations: {
                type: Sequelize.BOOLEAN,
                allowNull: true
            },
            mining_fee_satohis: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            txns: {
                type: Sequelize.ARRAY(Sequelize.STRING),
                allowNull: true
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
    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('address_forwards');
    }
};
//# sourceMappingURL=20190124024306-create-address-forward.js.map