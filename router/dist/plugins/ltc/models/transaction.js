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
    var Transaction = sequelize.define('Transaction', {
        hash: DataTypes.STRING
    }, {
        tableName: 'transactions',
        hooks: {
            afterCreate: function (instance) {
                return __awaiter(this, void 0, void 0, function* () {
                    yield events_1.publishEvent('transaction.created', instance.hash);
                });
            }
        },
        classMethods: {
            associate: function (models) {
                // associations can be defined here
            }
        }
    });
    return Transaction;
};
//# sourceMappingURL=transaction.js.map