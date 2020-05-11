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
const jsonrpc_1 = require("./jsonrpc");
const _ = require("lodash");
require('dotenv').config();
const litecoin = require("bitcore-lib-litecoin");
const models = require('../models');
const events_1 = require("./events");
const router_client_1 = require("../../../lib/router_client");
function forwardPayment(txid) {
    return __awaiter(this, void 0, void 0, function* () {
        let fee = 0.0001;
        console.log("getransaction", txid);
        let tx = yield jsonrpc_1.rpcCall('gettransaction', [txid]);
        console.log("got transaction", tx);
        let rawTx = yield jsonrpc_1.rpcCall('decoderawtransaction', [tx.hex]);
        var route;
        for (let i = 0; i < rawTx.vout.length; i++) {
            let address = rawTx.vout[i].scriptPubKey.addresses[0];
            route = yield router_client_1.lookupOutputFromInput('LTC', address);
            console.log('ROUTE', route);
            if (route) {
                break;
            }
        }
        try {
            let output = route.output.address;
            console.log('output address', output);
            let address = new litecoin.Address(output);
        }
        catch (error) {
            console.error("invalid litecoin address", route.output.address);
            return;
        }
        if (!route) {
            console.log('no address route for transaction');
            return;
        }
        else {
            console.log("route", route);
        }
        let utxo = _.find(rawTx.vout, out => {
            return out.scriptPubKey.addresses[0] === route.input.address;
        });
        let outputs = {};
        outputs[route.output.address] = parseFloat((utxo.value - fee).toFixed(6));
        let params = [
            [{
                    txid,
                    vout: utxo.n
                }],
            outputs
        ];
        try {
            var newRawTx = yield jsonrpc_1.rpcCall('createrawtransaction', params);
        }
        catch (error) {
            console.error('createrawtransaction.error', error.response.body.error.message);
            yield events_1.publishEvent('error', {
                stage: 'createrawtransaction',
                txid,
                message: error.message,
                response: error.response.body.error.message
            });
            throw error;
        }
        try {
            var signedtx = yield jsonrpc_1.rpcCall('signrawtransaction', [newRawTx]);
        }
        catch (error) {
            console.error('signrawtransaction.error', error.response.body.error.message);
            yield events_1.publishEvent('error', {
                stage: 'signrawtransaction',
                txid,
                message: error.message,
                response: error.response.body.error.message
            });
            throw error;
        }
        if (!signedtx.complete) {
            throw new Error(signedtx.errors[0].error);
        }
        try {
            var newtx = yield jsonrpc_1.rpcCall('sendrawtransaction', [signedtx.hex]);
            let payment = {
                currency: 'LTC',
                address: route.input.address,
                amount: utxo.value / 100000000,
                hash: txid,
                output_hash: newtx
            };
            let channel = yield events_1.awaitChannel();
            channel.publish('anypay.payments', 'payment', new Buffer(JSON.stringify(payment)));
        }
        catch (error) {
            console.error('sendrawtransaction.error', error.response.body.error.message);
            yield events_1.publishEvent('error', {
                stage: 'sendrawtransaction',
                txid,
                message: error.message,
                response: error.response.body.error.message
            });
            throw error;
        }
    });
}
exports.forwardPayment = forwardPayment;
//# sourceMappingURL=forwarder.js.map