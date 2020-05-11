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
const lib_1 = require("../../lib");
const rabbi_1 = require("rabbi");
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        rabbi_1.Actor.create({
            exchange: 'anypay.router',
            routingkey: 'transaction.dash',
            queue: 'publish.dash.payment',
            schema: rabbi_1.Joi.object().keys({
                hex: rabbi_1.Joi.string().required()
            })
        })
            .start((channel, msg, json) => __awaiter(this, void 0, void 0, function* () {
            let payments = lib_1.transformHexToPayments(json.hex);
            payments.forEach((payment) => {
                console.log(payment);
                channel.publish('anypay.payments', 'payment', Buffer.from(JSON.stringify(payment)));
                channel.publish('anypay.payments', 'payment.dash', Buffer.from(JSON.stringify(payment)));
                channel.publish('anypay.payments', `payment.dash.${payment.address}`, Buffer.from(JSON.stringify(payment)));
            });
            channel.ack(msg);
        }));
    });
}
exports.start = start;
if (require.main === module) {
    start();
}
//# sourceMappingURL=actor.js.map