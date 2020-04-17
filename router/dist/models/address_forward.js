'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid");
const events_1 = require("../lib/events");
module.exports = function (sequelize, DataTypes) {
    var AddressForward = sequelize.define('AddressForward', {
        uid: {
            type: DataTypes.STRING,
            allowNull: true
        },
        destination: {
            type: DataTypes.STRING,
            allowNull: false
        },
        input_address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        token: {
            type: DataTypes.STRING,
            allowNull: true
        },
        process_fee_satoshis: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        process_fees_address: {
            type: DataTypes.STRING,
            allowNull: true
        },
        process_fees_percent: {
            type: DataTypes.DECIMAL,
            allowNull: true
        },
        callback_url: {
            type: DataTypes.STRING,
            allowNull: true
        },
        enable_confirmations: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        mining_fee_satohis: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        txns: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: true
        }
    }, {
        tableName: 'address_forwards',
        hooks: {
            beforeCreate: (instance, options) => __awaiter(this, void 0, void 0, function* () {
                instance.uid = uuid.v4();
                return instance;
            }),
            afterCreate: function (instance) {
                return __awaiter(this, void 0, void 0, function* () {
                    yield events_1.publishEvent('addressforward.created', instance.toJSON());
                });
            }
        },
        classMethods: {
            associate: function (models) {
                // associations can be defined here
            }
        }
    });
    return AddressForward;
};
//# sourceMappingURL=address_forward.js.map