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
const forwarder_factory_1 = require("../../lib/forwarder_factory");
const rabbi_1 = require("rabbi");
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        rabbi_1.Actor.create({
            exchange: 'anypay.router',
            routingkey: 'transaction.gold',
            queue: 'gold_tx_forwarder',
        })
            .start((channel, msg) => __awaiter(this, void 0, void 0, function* () {
            let tx = JSON.parse(msg.content.toString());
            if (tx.tokenInfo) {
                if (tx.tokenInfo.tokenIdHex != '8e635bcd1b97ad565b2fdf6b642e760762a386fe4df9e4961f2c13629221914f' || tx.tokenInfo.transactionType != 'SEND') {
                    channel.ack(msg);
                    return;
                }
                let forwarderFactory = new forwarder_factory_1.ForwarderFactory({
                    rpc: {
                        host: process.env.BCH_RPC_HOST,
                        port: process.env.BCH_RPC_PORT,
                        password: process.env.BCH_RPC_PASSWORD,
                        user: process.env.BCH_RPC_USER
                    },
                    xprivkey: process.env.GOLD_HD_PRIVATE_KEY,
                    bchOracleToken: process.env.GOLD_ORACLE_ACCESS_TOKEN,
                    amqpChannel: channel
                });
                let forwarder = forwarderFactory.newForwarder({ tx: tx });
                yield forwarder.getAddressRoute();
                if (forwarder.route) {
                    console.log("address route found ", forwarder.route);
                    yield forwarder.derivePrivateKey();
                    console.log("privkey derive", forwarder.privateKey);
                    yield forwarder.fundSLPAddress();
                    console.log('SLP address funded');
                    yield forwarder.sendGold();
                    console.log('Gold sent', forwarder.outputTx);
                    yield forwarder.publishForwarded();
                    console.log('forward published');
                }
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