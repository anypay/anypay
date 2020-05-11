"use strict";
/* implements rabbi actor protocol */
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
require('dotenv').config();
const rabbi_1 = require("rabbi");
const jsonrpc_1 = require("../../lib/jsonrpc");
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        rabbi_1.Actor.create({
            exchange: 'btc.anypay.global',
            routingkey: 'walletnotify',
            queue: 'btc.transform.txid.to.tx'
        })
            .start((channel, msg) => __awaiter(this, void 0, void 0, function* () {
            let tx = yield jsonrpc_1.rpcCall('gettransaction', [msg.content.toString()]);
            console.log(tx);
            channel.publish('anypay.router', 'transaction.btc', Buffer.from(JSON.stringify(tx)));
            channel.ack(msg);
        }));
    });
}
exports.start = start;
if (require.main === module) {
    start();
}
//# sourceMappingURL=actor.js.map