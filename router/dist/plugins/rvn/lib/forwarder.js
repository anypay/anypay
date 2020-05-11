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
const models = require('../models');
const callbacks_1 = require("./callbacks");
const events_1 = require("./events");
function forwardPayment(txid) {
    return __awaiter(this, void 0, void 0, function* () {
        let fee = 0.00001;
        console.log("getransaction", txid);
        let tx = yield jsonrpc_1.rpcCall('gettransaction', [txid]);
        console.log("got transaction", tx);
        let rawTx = yield jsonrpc_1.rpcCall('decoderawtransaction', [tx.hex]);
        var forward;
        for (let i = 0; i < rawTx.vout.length; i++) {
            forward = yield models.AddressForward.findOne({ where: {
                    input_address: rawTx.vout[i].scriptPubKey.addresses[0]
                } });
            if (forward) {
                break;
            }
        }
        if (!forward) {
            console.log('no address forward for transaction');
            return;
        }
        else {
            console.log("forward", forward.toJSON());
        }
        let utxo = _.find(rawTx.vout, out => {
            return out.scriptPubKey.addresses[0] === forward.input_address;
        });
        let outputs = {};
        var minimum = 0.0001;
        if (utxo.value < minimum) {
            console.log('value less than minimum amount to forward', utxo.value);
            return;
        }
        outputs[forward.destination] = parseFloat((utxo.value - fee).toFixed(6));
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
        let existingCallback = yield models.AddressForwardCallback.findOne({
            where: {
                destination_transaction_hash: newtx
            }
        });
        if (!existingCallback) {
            let forwardedPayment = yield models.AddressForwardCallback.create({
                value: utxo.value,
                input_address: forward.input_address,
                destination_address: forward.destination,
                input_transaction_hash: txid,
                destination_transaction_hash: newtx
            });
            let callback = forwardedPayment.toJSON();
            if (forward.callback_url) {
                let resp = yield callbacks_1.sendWebhook(forward.callback_url, callback);
                console.log('webhook.sent', resp.body);
            }
            return callback;
        }
        else {
            console.log('payment already forwarded');
        }
    });
}
exports.forwardPayment = forwardPayment;
//# sourceMappingURL=forwarder.js.map