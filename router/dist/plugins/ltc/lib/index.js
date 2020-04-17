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
const validator_1 = require("validator");
const jsonrpc_1 = require("./jsonrpc");
const forwarder_1 = require("./forwarder");
const http = require("superagent");
const models = require('../models');
function forwardUnspent() {
    return __awaiter(this, void 0, void 0, function* () {
        var resp;
        try {
            resp = yield jsonrpc_1.rpcCall('listunspent', [0]);
        }
        catch (error) {
            console.log(error);
        }
        console.log(`\n\n\n\n\n${resp.length} unspent outputs found\n\n\n\n\n`);
        for (let i = 0; i < resp.length; i++) {
            console.log(`looking up forward for address ${resp[i].address}`);
            let forward = yield models.AddressForward.findOne({
                where: {
                    input_address: resp[i].address
                }
            });
            if (forward) {
                console.log('found unspent output to forward');
                yield forwarder_1.forwardPayment(resp[i].txid);
                console.log('found unspent output to forward');
            }
            else {
                console.log(`no forward found for address ${resp[i].address}`);
            }
        }
    });
}
exports.forwardUnspent = forwardUnspent;
function getMemPoolTxs() {
    return __awaiter(this, void 0, void 0, function* () {
        let resp = yield http.post(`https://${process.env.LTC_RPC_HOST}`)
            .auth(process.env.LTC_RPC_USER, process.env.LTC_RPC_PASSWORD)
            .send({
            method: 'getrawmempool',
            params: []
        });
        return resp.body.result;
    });
}
exports.getMemPoolTxs = getMemPoolTxs;
function getNewAddress() {
    return __awaiter(this, void 0, void 0, function* () {
        let address = yield jsonrpc_1.rpcCall('getnewaddress');
        return address;
    });
}
exports.getNewAddress = getNewAddress;
function wait(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
function pollAddressForPayments(address) {
    return __awaiter(this, void 0, void 0, function* () {
        let interval = 10000; // ten seconds
        let total = 60; // ten minutes
        for (let i = 0; i < total; i++) {
            let payments = yield publishTxnsForAddress(address);
            if (payments.length > 0) {
                break;
            }
            yield wait(interval);
        }
    });
}
exports.pollAddressForPayments = pollAddressForPayments;
function publishTxnsForAddress(address) {
    return __awaiter(this, void 0, void 0, function* () {
        var txns;
        return txns;
    });
}
exports.publishTxnsForAddress = publishTxnsForAddress;
function validateAddress(address) {
    return __awaiter(this, void 0, void 0, function* () {
        let response = yield jsonrpc_1.rpcCall('validateaddress', [address]);
        return response.isvalid;
    });
}
exports.validateAddress = validateAddress;
function createAddressForward(options) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!validateAddress(options.destination)) {
            throw new Error(`invalid litecoin address ${options.destination}`);
        }
        if (options.callback_url && !validator_1.isURL(options.callback_url)) {
            throw new Error(`invalid callback url ${options.callback_url}`);
        }
        logger_1.log.info('createaddressforward', options);
        let input_address = yield getNewAddress();
        let record = yield models.AddressForward.create(Object.assign(options, {
            input_address
        }));
        return record;
    });
}
exports.createAddressForward = createAddressForward;
//# sourceMappingURL=index.js.map