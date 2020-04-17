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
const amqplib_1 = require("amqplib");
var connection;
exports.connection = connection;
var channel;
exports.channel = channel;
var channelIsConnected = false;
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
        exports.connection = connection = yield amqplib_1.connect(process.env.AMQP_URL);
        exports.channel = channel = yield connection.createChannel();
        channelIsConnected = true;
    });
})();
//# sourceMappingURL=amqp.js.map