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
const dash = require("@dashevo/dashcore-lib");
const router_client_1 = require("../../../lib/router_client");
let Transaction = dash.Transaction;
let Script = dash.Script;
const jsonrpc_1 = require("./jsonrpc");
function getAddressRouteFromTx(tx) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('getting tx for: ', tx);
        var route;
        var value;
        for (let i = 0; i < tx.outputs.length; i++) {
            let address = tx.outputs[i].script.toAddress().toString();
            console.log('Tx Address', address);
            try {
                route = yield router_client_1.lookupOutputFromInput('DASH', address);
                console.log(`route found for ${address}`);
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
        return yield jsonrpc_1.rpcCall('sendrawtransaction', [tx.toString()]);
    });
}
exports.broadcastSignedTx = broadcastSignedTx;
function transformHexToPayments(hex) {
    let tx = new dash.Transaction(hex);
    return tx.outputs.map((output) => {
        return {
            currency: 'DASH',
            hash: tx.hash.toString(),
            amount: satoshisToDASH(output.satoshis),
            address: output.script.toAddress().toString()
        };
    });
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
    fee = dashToSatoshis(fee);
    if (input.satoshis < fee) {
        throw (new RangeError(`Fee: ${fee} satoshis is greater than the unspent output: ${input.satoshis} satoshis`));
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
function satoshisToDASH(sats) {
    return sats / 100000000;
}
function dashToSatoshis(dash) {
    return dash * 100000000 | 0;
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