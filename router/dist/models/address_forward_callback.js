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
const events_1 = require("../lib/events");
module.exports = function (sequelize, DataTypes) {
    var AddressForwardCallback = sequelize.define('AddressForwardCallback', {
        value: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            get() {
                return parseFloat(this.getDataValue("value"));
            }
        },
        destination_address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        input_address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        input_transaction_hash: {
            type: DataTypes.STRING,
            allowNull: false
        },
        destination_transaction_hash: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'address_forward_callbacks',
        hooks: {
            afterCreate: function (instance) {
                return __awaiter(this, void 0, void 0, function* () {
                    yield events_1.publishEvent('addressforwardcallback.created', instance.toJSON());
                });
            }
        },
        classMethods: {
            associate: function (models) {
                // associations can be defined here
            }
        }
    });
    return AddressForwardCallback;
};
//# sourceMappingURL=address_forward_callback.js.map