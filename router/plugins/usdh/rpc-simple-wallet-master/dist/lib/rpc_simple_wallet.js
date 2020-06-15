"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const jsonrpc_1 = require("./jsonrpc");
const bignumber_js_1 = require("bignumber.js");
const bitcoinCom = require("./bitcoin_com");
class RPCSimpleWallet extends jsonrpc_1.JsonRPC {
    constructor(coin, address) {
        super(coin);
        this.coin = coin;
        ;
        if (address) {
            this.address = address;
        }
    }
    getUtxos() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.coin === 'BCH') {
                return bitcoinCom.getUtxos(this.address);
            }
            let utxos = yield this.call('listunspent', [0, 9999999, [this.address]]);
            return utxos;
        });
    }
    updateWallet() {
        return __awaiter(this, void 0, void 0, function* () {
            let utxos = yield this.getUtxos();
            this.utxos = utxos.sort((a, b) => a.amount > b.amount);
            this.balance = yield this.getAddressUnspentBalance();
        });
    }
    getNewAddress() {
        return __awaiter(this, void 0, void 0, function* () {
            let resp = yield this.call('getnewaddress');
            this.address = resp;
            return resp;
        });
    }
    getAddressUnspentBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.utxos) {
                yield this.updateWallet();
            }
            return this.utxos.reduce((sum, tx) => {
                return sum.plus(tx.amount);
            }, new bignumber_js_1.BigNumber(0)).toNumber();
        });
    }
    sendToAddress(address, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.balance < amount) {
                throw new Error(`insufficient balance to send ${amount}`);
            }
            var inputs = [];
            var sumInputs = new bignumber_js_1.BigNumber(0);
            var fee = new bignumber_js_1.BigNumber(this.fee);
            for (let i = 0; i < this.utxos.length; i++) {
                inputs.push(this.utxos[i]);
                sumInputs = sumInputs.plus(new bignumber_js_1.BigNumber(this.utxos[i].amount));
                let a = new bignumber_js_1.BigNumber(amount);
                if (sumInputs.isGreaterThanOrEqualTo(a.plus(fee))) {
                    break;
                }
            }
            let outputs = {};
            let outputAmount = new bignumber_js_1.BigNumber(amount);
            outputs[address] = parseFloat(amount.toFixed(8));
            let changeAmount = sumInputs
                .minus(outputAmount)
                .minus(this.fee)
                .toNumber();
            if (changeAmount > 0) {
                // must be eight decimals max to be valid
                outputs[this.address] = parseFloat(changeAmount.toFixed(8));
            }
            console.log('OUTPUTS', outputs);
            let params = [
                inputs.map(i => {
                    return {
                        txid: i.txid,
                        vout: i.vout
                    };
                }),
                outputs
            ];
            var newRawTx;
            try {
                console.log('create raw tx params', params);
                newRawTx = yield this.call('createrawtransaction', params);
                console.log("new raw tx");
            }
            catch (error) {
                console.error(error);
                throw error;
            }
            var signedtx;
            try {
                signedtx = yield this.call('signrawtransaction', [newRawTx]);
                console.log('signedtx', signedtx);
            }
            catch (error) {
                console.error('signrawtransaction.error', error.message);
                throw error;
            }
            if (!signedtx.complete) {
                throw new Error(signedtx.errors[0].error);
            }
            var newtx;
            try {
                newtx = yield this.call('sendrawtransaction', [signedtx.hex]);
            }
            catch (error) {
                console.error('sendrawtransaction.error', error);
            }
            return newtx;
        });
    }
    setAddress(address) {
        return __awaiter(this, void 0, void 0, function* () {
            this.address = address;
        });
    }
}
exports.RPCSimpleWallet = RPCSimpleWallet;
//# sourceMappingURL=rpc_simple_wallet.js.map