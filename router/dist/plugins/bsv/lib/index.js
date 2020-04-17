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
const bsv = require("bsv");
const router_client_1 = require("../../../lib/router_client");
let Transaction = bsv.Transaction;
let Script = bsv.Script;
const jsonrpc_1 = require("./jsonrpc");
function getAddressRouteFromTx(tx) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('getting tx for: ', tx);
        var route;
        var value;
        for (let i = 0; i < tx.outputs.length; i++) {
            let address = tx.outputs[i].script.toAddress().toString();
            try {
                route = yield router_client_1.lookupOutputFromInput('BSV', address);
                console.log(`route found for ${address}`, route);
            }
            catch (error) {
                console.error(error.message);
            }
            if (route) {
                break;
            }
        }
        if (!route) {
            throw (`No Address route found for tx ${tx.hash}`);
        }
        return route;
    });
}
exports.getAddressRouteFromTx = getAddressRouteFromTx;
function broadcastSignedTx(tx) {
    return __awaiter(this, void 0, void 0, function* () {
        let txid = yield jsonrpc_1.rpcCall('sendrawtransaction', [tx.toString()]);
        console.log('result', txid);
        console.log('tx', tx);
        return txid;
    });
}
exports.broadcastSignedTx = broadcastSignedTx;
function transformHexToPayments(hex) {
    let tx = new bsv.Transaction(hex);
    let payments = [];
    for (let i = 0; i < tx.outputs.length; i++) {
        let address = tx.outputs[i].script.toAddress().toString();
        let paymentIndex = payments.findIndex((elem) => { return elem.address === address; });
        if (paymentIndex > -1) {
            payments[paymentIndex] = {
                currency: 'BSV',
                hash: tx.hash.toString(),
                amount: satoshisToBSV(tx.outputs[i].satoshis) + payments[paymentIndex].amount,
                address: tx.outputs[i].script.toAddress().toString()
            };
        }
        else {
            payments.push({
                currency: 'BSV',
                hash: tx.hash.toString(),
                amount: satoshisToBSV(tx.outputs[i].satoshis),
                address: tx.outputs[i].script.toAddress().toString()
            });
        }
    }
    console.log(payments);
    return payments;
}
exports.transformHexToPayments = transformHexToPayments;
function createOutputTxFromInputTx(inputTx, route, fee = .00002) {
    let utxos = inputTx.outputs.reduce((result, output, index) => {
        if (output.script.toAddress().toString() == route.input.address) {
            result.push({ "utxo": output, "index": index });
        }
        return result;
    }, []);
    let input = utxos[0].utxo;
    let index = utxos[0].index;
    fee = bsvToSatoshis(fee);
    if (input.satoshis < fee) {
        throw (new RangeError(`Fee: ${fee} satoshis is greater than the unspent output: ${input.satoshis} satoshis`));
        return;
    }
    let utxo = {
        "txId": inputTx.hash,
        "outputIndex": index,
        "satoshis": input.satoshis,
        "address": input.script.toAddress().toString(),
        "script": input.script.toHex()
    };
    let amountToSpend = input.satoshis - fee;
    let outputTx = new Transaction()
        .from(utxo)
        .to(route.output.address, amountToSpend);
    return outputTx;
}
exports.createOutputTxFromInputTx = createOutputTxFromInputTx;
function signTransaction(tx, pk) {
    return tx.sign(pk);
}
exports.signTransaction = signTransaction;
function satoshisToBSV(sats) {
    return sats / 100000000;
}
function bsvToSatoshis(bsv) {
    return bsv * 100000000 | 0;
}
function getSmartFee(numberOfConf) {
    return __awaiter(this, void 0, void 0, function* () {
        let resp = yield jsonrpc_1.rpcCall('estimatesmartfee', [numberOfConf]);
        return resp.feerate;
    });
}
exports.getSmartFee = getSmartFee;
function derivePrivateKey(pk, nonce) {
    return pk.deriveChild(nonce).privateKey.toString();
}
exports.derivePrivateKey = derivePrivateKey;
//# sourceMappingURL=index.js.map