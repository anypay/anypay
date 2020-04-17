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
const rabbi_1 = require("rabbi");
const Joi = require("joi");
const rvn_1 = require("../../lib/rvn");
const exchange = 'anypay.router';
const routingkey = 'outputs.RVN/FREE_STATE_BANK/AUG';
const queue = 'outputs.send.RVN/FREE_STATE_BANK/AUG';
const schema = Joi.object().keys({
    uid: Joi.string().required(),
    address: Joi.string().required(),
    currency: Joi.string().required(),
    amount: Joi.number().required()
});
require('dotenv').config();
const logger_1 = require("../../lib/logger");
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        rabbi_1.Actor.create({
            exchange,
            routingkey,
            queue
        })
            .start((channel, msg) => __awaiter(this, void 0, void 0, function* () {
            var content;
            try {
                content = JSON.parse(msg.content.toString());
                logger_1.log.info('outputs.send.RVN/FREE_STATE_BANK/AUG', content);
            }
            catch (error) {
                logger_1.log.error(error.message);
                yield channel.ack(msg);
                return;
            }
            const result = schema.validate(content);
            if (result.error) {
                logger_1.log.error(`invalid schema ${result.error}`);
                yield channel.ack(msg);
                return;
            }
            logger_1.log.info('valid schema');
            if (content.currency !== 'RVN/FREE_STATE_BANK/AUG') {
                logger_1.log.error('currency must be RVN/FREE_STATE_BANK/AUG');
                yield channel.ack(msg);
                return;
            }
            /*
             * check to see payment already sent with given uid, which
             * should usually be a BSV transaction id.
             *
             */
            try {
                let resp = yield rvn_1.sendAUGOnce(content.address, content.amount, content.uid);
                console.log(resp.toJSON());
            }
            catch (error) {
                console.error(error.message);
                /* send to back of queue */
                yield channel.ack(msg);
                yield channel.publish(exchange, routingkey, msg.content);
            }
        }));
    });
}
if (require.main === module) {
    start();
}
//# sourceMappingURL=actor.js.map