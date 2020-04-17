"use strict";
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
const models = require('../models');
const amqp_1 = require("./amqp");
function initializeRouterTransaction(tx) {
    return __awaiter(this, void 0, void 0, function* () {
        let record = models.RouterTransaction.create(tx);
        let channel = yield amqp_1.awaitChannel();
        yield channel.publish('anypay.router', 'RouterTransactionInputSuccess', new Buffer(JSON.stringify(tx)));
        return record;
    });
}
exports.initializeRouterTransaction = initializeRouterTransaction;
//# sourceMappingURL=router_transaction.js.map