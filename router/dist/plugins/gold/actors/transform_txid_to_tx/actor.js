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
const BITBOXSDK = require('bitbox-sdk');
const slpjs = require('slpjs');
const BITBOX = new BITBOXSDK.BITBOX({ restURL: 'https://rest.bitcoin.com/v2/' });
const bitboxNetwork = new slpjs.BitboxNetwork(BITBOX);
require('dotenv').config();
const txs = {};
var CACHE_EXPIRY_MILLISECONDS = 1000;
const rabbi_1 = require("rabbi");
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        rabbi_1.Actor.create({
            exchange: 'bch.anypay.global',
            routingkey: 'walletnotify',
            queue: 'transform.txid.to.tx.gold'
        })
            .start((channel, msg) => __awaiter(this, void 0, void 0, function* () {
            try {
                let txid = msg.content.toString();
                if (!(yield getTx(txid))) {
                    let tx = yield bitboxNetwork.getTransactionDetails(msg.content.toString());
                    yield setTx(txid);
                    channel.publish('anypay.router', 'transaction.gold', Buffer.from(JSON.stringify(tx)));
                }
            }
            catch (e) {
            }
            channel.ack(msg);
        }));
    });
}
exports.start = start;
if (require.main === module) {
    start();
}
function getTx(txid) {
    return __awaiter(this, void 0, void 0, function* () {
        if (txs[txid]) {
            return true;
        }
        else {
            return false;
        }
    });
}
function setTx(txid) {
    return __awaiter(this, void 0, void 0, function* () {
        txs[txid] = true;
        // expire cache after a set time
        setTimeout(() => {
            delete txs[txid];
        }, CACHE_EXPIRY_MILLISECONDS);
        return CACHE_EXPIRY_MILLISECONDS;
    });
}
//# sourceMappingURL=actor.js.map