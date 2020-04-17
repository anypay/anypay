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
const events_1 = require("../../lib/events");
const callbacks_1 = require("../../lib/callbacks");
const queue = 'callbacks';
const routingKey = 'addressforwardcallback.created';
const models = require('../../models');
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        yield events_1.awaitChannel();
        console.log('channel connected');
        yield events_1.channel.assertExchange(events_1.exchange, 'direct');
        yield events_1.channel.assertQueue(queue);
        yield events_1.channel.bindQueue(queue, events_1.exchange, routingKey);
        events_1.channel.consume(queue, (message) => __awaiter(this, void 0, void 0, function* () {
            let callback = JSON.parse(message.content.toString());
            console.log('process callback', callback);
            let addressForward = yield models.AddressForward.findOne({
                where: {
                    input_address: callback.input_address
                }
            });
            if (!addressForward.callback_url) {
                console.log(`no callback url set for forward ${addressForward.id}`);
                yield events_1.channel.ack(message);
                return;
            }
            try {
                let resp = yield callbacks_1.sendWebhook(addressForward.callback_url, callback);
                console.log('webhook.sent', resp.body);
                events_1.channel.ack(message);
            }
            catch (error) {
                console.log(error.message, error.response.body.error.message);
                events_1.channel.ack(message);
            }
        }));
    });
}
exports.start = start;
if (require.main === module) {
    start();
}
//# sourceMappingURL=actor.js.map