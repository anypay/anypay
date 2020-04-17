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
const rabbi_1 = require("rabbi");
require('dotenv').config();
const forwarder_1 = require("../../lib/forwarder");
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        rabbi_1.Actor.create({
            exchange: 'rvn.anypay.global',
            routingkey: 'walletnotify',
            queue: 'rvn.walletnotify.forwardpayment'
        })
            .start((channel, msg) => __awaiter(this, void 0, void 0, function* () {
            try {
                let txid = msg.content.toString();
                let resp = yield forwarder_1.forwardPayment(txid);
                console.log('forward payment resp', resp);
            }
            catch (error) {
                console.error('error forwding payment', error.message);
            }
            channel.ack(msg);
        }));
    });
}
exports.start = start;
if (require.main === module) {
    start();
}
//# sourceMappingURL=actor.js.map