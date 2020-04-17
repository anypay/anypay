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
require('dotenv').config();
const logger_1 = require("./logger");
const amqplib_1 = require("amqplib");
var channel;
exports.channel = channel;
var connection;
var channelIsConnected = false;
const exchange = 'ltc.anypay.global';
exports.exchange = exchange;
function wait(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    });
}
function awaitChannel() {
    return __awaiter(this, void 0, void 0, function* () {
        while (!channelIsConnected) {
            yield wait(100);
        }
        return channel;
    });
}
exports.awaitChannel = awaitChannel;
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        let connection = yield amqplib_1.connect(process.env.AMQP_URL);
        exports.channel = channel = yield connection.createChannel();
        yield channel.assertExchange(exchange, 'direct');
        console.log("CHANNEL CONNECTED");
        channelIsConnected = true;
    });
})();
function publishEvent(key, payload) {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.log.info(key, payload);
        if (typeof payload !== 'string') {
            payload = JSON.stringify(payload);
        }
        yield channel.publish(exchange, key, new Buffer(payload));
    });
}
exports.publishEvent = publishEvent;
//# sourceMappingURL=events.js.map