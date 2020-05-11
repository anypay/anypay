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
const events_1 = require("./events");
const _ = require("lodash");
const underscore = require("underscore");
const bignumber_js_1 = require("bignumber.js");
const models = require('../models');
function forwardUnspent() {
    return __awaiter(this, void 0, void 0, function* () {
        let resp = yield jsonrpc_1.rpcCall('listunspent', [0]);
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
        let resp = yield http.post(`${process.env.BCH_RPC_HOST}:${process.env.BCH_RPC_PORT}`)
            .auth(process.env.BCH_RPC_USER, process.env.BCH_RPC_PASSWORD)
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
        let resp = yield http.get(`https://rest.bitcoin.com/v1/address/details/${address}`);
        yield events_1.awaitChannel();
        let routingKey = 'transaction.created';
        let txns = resp.body.transactions;
        for (let i = 0; i < txns.length; i++) {
            let tx = txns[i];
            console.log(tx);
            yield events_1.channel.publish(events_1.exchange, routingKey, new Buffer(tx));
        }
        return txns;
    });
}
exports.publishTxnsForAddress = publishTxnsForAddress;
function createAddressForward(options) {
    return __awaiter(this, void 0, void 0, function* () {
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
function sweepDust() {
    return __awaiter(this, void 0, void 0, function* () {
        let price = new bignumber_js_1.BigNumber(150);
        let fee = (new bignumber_js_1.BigNumber(0.1)).dividedBy(price);
        console.log('ten cents', fee);
        let unspent = yield jsonrpc_1.rpcCall('listunspent');
        let change = 'bitcoincash:qz7lh923zdpw6mwtrwsh5kz6y73avghxagup3qlpw5';
        console.log('unspent', unspent);
        let dustInputs = _.filter(unspent, utxo => {
            return utxo.amount < 0.0001;
        }).map(utxo => {
            return {
                "txid": utxo.txid,
                "vout": utxo.vout,
                "amount": new bignumber_js_1.BigNumber(utxo.amount)
            };
        });
        console.log('dust inputs', dustInputs);
        let changeInputs = _.filter(unspent, utxo => {
            return utxo.address === change;
        });
        var changeInput = underscore.max(changeInputs, function (i) {
            return i.amount;
        });
        console.log("change input", changeInput);
        let totalDust = dustInputs.reduce((sum, input) => {
            return sum.plus(input.amount);
        }, new bignumber_js_1.BigNumber(0));
        console.log('total dust', totalDust.toNumber());
        if (totalDust.toNumber() === 0) {
            return;
        }
        let changeInputAmount = new bignumber_js_1.BigNumber(changeInput.amount);
        let changeAmount = changeInputAmount.plus(totalDust).minus(fee);
        console.log("change amount", changeAmount.toPrecision(8));
        let outputs = {};
        outputs[change] = parseFloat(changeAmount.toPrecision(8));
        let inputs = dustInputs.map(i => {
            return {
                "txid": i.txid,
                "vout": i.vout
            };
        });
        inputs.push({
            "txid": changeInput.txid,
            "vout": changeInput.vout
        });
        let rawtx = yield jsonrpc_1.rpcCall('createrawtransaction', [
            inputs,
            outputs
        ]);
        console.log("rawtx", rawtx);
        let signed = yield jsonrpc_1.rpcCall('signrawtransaction', [rawtx]);
        console.log("signedrawtx", signed);
        let res = yield jsonrpc_1.rpcCall('sendrawtransaction', [signed.hex]);
        console.log('res', res);
    });
}
exports.sweepDust = sweepDust;
//# sourceMappingURL=index.js.map