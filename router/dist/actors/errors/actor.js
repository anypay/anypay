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
const http = require("superagent");
const queue = 'errors';
const routingKey = 'error';
function sendErrorToSlack(error) {
    return __awaiter(this, void 0, void 0, function* () {
        let resp = yield http
            .post('https://hooks.slack.com/services/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')
            .send({
            text: error
        });
        return resp;
    });
}
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        yield events_1.awaitChannel();
        yield events_1.channel.assertExchange(events_1.exchange, 'direct');
        yield events_1.channel.assertQueue(queue);
        yield events_1.channel.bindQueue(queue, events_1.exchange, routingKey);
        events_1.channel.consume(queue, (message) => __awaiter(this, void 0, void 0, function* () {
            let error = message.content.toString();
            console.error("ERROR", error);
            yield sendErrorToSlack(error);
            events_1.channel.ack(message);
        }));
    });
}
exports.start = start;
if (require.main === module) {
    start();
}
//# sourceMappingURL=actor.js.map