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
require("dotenv").config();
const http = require("superagent");
const models = require('../models');
function rpc(method, params = []) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let resp = yield http
                .post(`http://${process.env.RVN_RPC_HOST}:${process.env.RVN_RPC_PORT}`)
                .auth(process.env.RVN_RPC_USER, process.env.RVN_RPC_PASSWORD)
                .send({
                method,
                params
            });
            return resp.body.result;
        }
        catch (error) {
            console.error(error.message, error.response.body.error.message);
            throw error;
        }
    });
}
exports.rpc = rpc;
let cache = {};
function sendAUGOnce(address, amount, uid) {
    return __awaiter(this, void 0, void 0, function* () {
        var record = yield models.RouterTransaction.findOne({ where: {
                input_txid: uid
            } });
        if (record) {
            console.log('router transaction exists');
        }
        else {
            let result = yield rpc('transfer', [
                'FREE_STATE_BANK/AUG',
                amount,
                address
            ]);
            record = yield models.RouterTransaction.create({
                input_txid: uid,
                output_txid: result[0],
                output_currency: 'RVN/FREE_STATE_BANK/AUG',
                output_amount: amount,
                output_address: address
            });
        }
        return record;
    });
}
exports.sendAUGOnce = sendAUGOnce;
function sendAUG(amount, address) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield rpc('transfer', [
            'FREE_STATE_BANK/AUG',
            amount,
            address
        ]);
        return result[0];
    });
}
exports.sendAUG = sendAUG;
//# sourceMappingURL=rvn.js.map