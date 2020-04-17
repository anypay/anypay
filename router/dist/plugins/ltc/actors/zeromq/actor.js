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
var zmq = require('zeromq');
var sock = zmq.socket('sub');
const logger_1 = require("../../lib/logger");
const models = require('../../models');
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        sock.connect(process.env.LTC_ZEROMQ_URL);
        sock.subscribe('hashtx');
        sock.subscribe('hashblock');
        sock.subscribe('rawtx');
        sock.subscribe('rawblock');
        logger_1.log.info(`zero worker connected to LTC`);
        sock.on('message', function (topic, msg) {
            return __awaiter(this, void 0, void 0, function* () {
                switch (topic.toString()) {
                    case 'hashtx':
                        let message = msg.toString('hex');
                        logger_1.log.info(`${topic.toString()} | ${message}`);
                        let tx = yield models.Transaction.create({ hash: message });
                        logger_1.log.info('transaction.created', tx.toJSON());
                        break;
                }
            });
        });
    });
}
exports.start = start;
if (require.main === module) {
    start();
}
//# sourceMappingURL=actor.js.map