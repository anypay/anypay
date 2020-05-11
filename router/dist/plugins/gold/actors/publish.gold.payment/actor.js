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
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        rabbi_1.Actor.create({
            exchange: 'anypay.router',
            routingkey: 'transaction.gold',
            queue: 'publish.gold.payment',
        })
            .start((channel, msg) => __awaiter(this, void 0, void 0, function* () {
            let tx = JSON.parse(msg.content.toString());
            let output = tx.vout.filter((out) => {
                if (out.scriptPubKey.slpAddrs) {
                    return true;
                }
                return false;
            });
            if (tx.tokenInfo.tokenIdHex != '8e635bcd1b97ad565b2fdf6b642e760762a386fe4df9e4961f2c13629221914f' || tx.tokenInfo.transactionType != 'SEND') {
                channel.ack(msg);
                return;
            }
            console.log(tx);
            console.log(tx.tokenInfo.sendOutputs);
            output.forEach((out, index) => {
                index = index + 1;
                let payment = {
                    currency: 'GOLD',
                    address: out.scriptPubKey.slpAddrs[0],
                    amount: tx.tokenInfo.sendOutputs[index] / 1000,
                    hash: tx.txid
                };
                console.log('payment', payment);
                channel.publish('anypay.payments', 'payment', Buffer.from(JSON.stringify(payment)));
                channel.publish('anypay.payments', 'payment.gold', Buffer.from(JSON.stringify(payment)));
                channel.publish('anypay.payments', `payment.gold.${payment.address}`, Buffer.from(JSON.stringify(payment)));
            });
            channel.ack(msg);
        }));
    });
}
exports.start = start;
if (require.main === module) {
    start();
}
//# sourceMappingURL=actor.js.map