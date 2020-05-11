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
            routingkey: 'transaction.btc',
            queue: 'btc_tx_forwarder',
            schema: rabbi_1.Joi.object().keys({
                hex: rabbi_1.Joi.string().required()
            })
        })
            .start((channel, msg, json) => __awaiter(this, void 0, void 0, function* () {
            rabbi_1.log.info(json);
            let forwarderFactory = new forwarder_factory_1.ForwarderFactory({
                rpc: {
                    host: process.env.BTC_RPC_HOST,
                    port: process.env.BTC_RPC_PORT,
                    password: process.env.BTC_RPC_PASSWORD,
                    user: process.env.BTC_RPC_USER
                },
                xprivkey: process.env.BTC_HD_PRIVATE_KEY,
                btcOracleToken: process.env.BTC_ORACLE_ACCESS_TOKEN,
                amqpChannel: channel
            });
            let forwarder = forwarderFactory.newForwarder({ hex: json.hex });
            console.log(forwarder);
            yield forwarder.getAddressRoute();
            console.log("address route found");
            yield forwarder.derivePrivateKey();
            console.log("privkey derived");
            yield forwarder.buildOutput();
            console.log("output build");
            yield forwarder.signOutput();
            console.log("output signed");
            yield forwarder.broadcastOutput();
            console.log("output broadcasted");
            yield forwarder.publishForwarded();
            console.log("published forwarded");
            channel.ack(msg);
        }));
    });
}
exports.start = start;
if (require.main === module) {
    start();
}
//# sourceMappingURL=actor.js.map