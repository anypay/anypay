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
const rabbi_1 = require("rabbi");
const jsonrpc_1 = require("../../lib/jsonrpc");
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        rabbi_1.Actor.create({
            exchange: 'anypay.events',
            routingkey: 'models.Invoice.afterCreate',
            queue: 'dash_invoice_created_importaddress',
            schema: rabbi_1.Joi.object().keys({
                address: rabbi_1.Joi.string(),
                uid: rabbi_1.Joi.string(),
                currency: rabbi_1.Joi.string()
            })
        })
            .start((channel, msg, json) => __awaiter(this, void 0, void 0, function* () {
            console.log(json);
            if (json.currency !== 'DASH') {
                return channel.ack(msg);
            }
            rabbi_1.log.info(msg.content.toString());
            rabbi_1.log.info(json);
            let resp = yield jsonrpc_1.rpcCall('importaddress', [json.address, json.uid, false]);
            console.log(resp);
            yield channel.ack(msg);
        }));
    });
}
exports.start = start;
if (require.main === module) {
    start();
}
//# sourceMappingURL=actor.js.map