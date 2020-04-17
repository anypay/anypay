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
const lib_1 = require("../../lib/");
const events_1 = require("../../lib/events");
const queue = 'addresspollers';
const routingKey = 'addressforward.created';
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        yield events_1.awaitChannel();
        yield events_1.channel.assertExchange(events_1.exchange, 'direct');
        yield events_1.channel.assertQueue(queue);
        yield events_1.channel.bindQueue(queue, events_1.exchange, routingKey);
        events_1.channel.consume(queue, (message) => __awaiter(this, void 0, void 0, function* () {
            let forward = JSON.parse(message.content.toString());
            lib_1.pollAddressForPayments(forward.input_address);
            events_1.channel.ack(message);
        }));
        setInterval(() => __awaiter(this, void 0, void 0, function* () {
            let routingKey = 'transaction.created';
            let txns = yield lib_1.getMemPoolTxs();
            for (let i = 0; i < txns.length; i++) {
                yield events_1.channel.publish(events_1.exchange, routingKey, new Buffer(txns[i]));
                console.log('published tx', txns[i]);
            }
        }), 30000);
    });
}
exports.start = start;
if (require.main === module) {
    start();
}
//# sourceMappingURL=actor.js.map