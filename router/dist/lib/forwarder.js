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
const http = require("superagent");
const models = require('../models');
const events_1 = require("./events");
const callbacks_1 = require("./callbacks");
const events_2 = require("./events");
const bchaddrjs_1 = require("bchaddrjs");
function constructForwardPayment(payment) {
    return __awaiter(this, void 0, void 0, function* () {
        let outputs = {};
        let params = [
            [{
                    txid: payment.utxo_txid,
                    vout: payment.utxo_vout
                }],
            outputs
        ];
        outputs[payment.output_address] = parseFloat((payment.utxo_amount - payment.fee).toFixed(6));
        var newRawTx = yield jsonrpc_1.rpcCall('createrawtransaction', params);
        return newRawTx;
    });
}
function forwardPayment(txid, destination) {
    return __awaiter(this, void 0, void 0, function* () {
        /*
         * Lookup address route for BSV payment
         *
         * If route output currency is BSV forward payment
         *
         * If route output currency is not BSV enqueue output
         *
         */
        let fee = 0.00001;
        console.log("getransaction", txid);
        let tx = yield jsonrpc_1.rpcCall('gettransaction', [txid]);
        console.log('got transaction', tx);
        let rawTx = yield jsonrpc_1.rpcCall('decoderawtransaction', [tx.hex]);
        var forward;
        var forwardAddress;
        for (let i = 0; i < rawTx.vout.length; i++) {
            let address = bchaddrjs_1.toLegacyAddress(rawTx.vout[i].scriptPubKey.addresses[0]);
            try {
                let resp = yield http
                    .get(`https://api.anypay.global/address_routes/BSV/${address}`)
                    .auth(process.env.BSV_ORACLE_ACCESS_TOKEN, '');
                forward = {
                    input_address: resp.body.input.address,
                    output_address: resp.body.output.address
                };
                console.log('forward', forward);
            }
            catch (error) {
                console.log(`error getting route for ${address}`, error.message);
                console.error(error.message);
            }
            if (forward) {
                break;
            }
        }
        if (!forward) {
            return;
        }
        console.log(rawTx.vout);
        let utxo = _.find(rawTx.vout, out => {
            return bchaddrjs_1.toLegacyAddress(out.scriptPubKey.addresses[0]) === forward.input_address;
        });
        let outputs = {};
        var minimum = 0.0001;
        if (utxo.value < minimum) {
            console.log('value less than minimum amount to forward', utxo.value);
            return;
        }
        outputs[forward.output_address] = parseFloat((utxo.value - fee).toFixed(6));
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
            yield events_2.publishEvent('error', {
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
            yield events_2.publishEvent('error', {
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
            yield events_2.publishEvent('error', {
                stage: 'sendrawtransaction',
                txid,
                message: error.message,
                response: error.response.body.error.message
            });
            throw error;
        }
        /*
        let existingCallback = await models.AddressForwardCallback.findOne({
    
          where: {
    
            destination_transaction_hash: newtx
    
          }
    
        });
        */
        let paymentMessage = JSON.stringify({
            address: forward.input_address,
            currency: 'BSV',
            amount: utxo.value,
            hash: txid
        });
        yield events_1.channel.publish('anypay.payments', 'payment', new Buffer(paymentMessage));
        console.log('payment message published', paymentMessage);
        var existingCallback;
        if (!existingCallback) {
            let newCallback = {
                value: utxo.value,
                input_address: forward.input_address,
                destination_address: forward.output_address,
                input_transaction_hash: txid,
                destination_transaction_hash: newtx
            };
            console.log('payment.forwarded', newCallback);
            yield events_1.channel.publish('anypay.forwarder', 'payment.forwarded', new Buffer(JSON.stringify(newCallback)));
            console.log('amqp.published.payment.forwarded', JSON.stringify(newCallback));
            let forwardedPayment = yield models.AddressForwardCallback.create(newCallback);
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