#!/usr/bin/env ts-node
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
const program = require("commander");
const lib_1 = require("../lib");
const bitcore_lib_cash_1 = require("bitcore-lib-cash");
const jsonrpc_1 = require("../lib/jsonrpc");
const http = require("superagent");
const _ = require("lodash");
const models = require('../models');
require('dotenv').config();
const sequelize_1 = require("sequelize");
const bignumber_js_1 = require("bignumber.js");
const forwarder_1 = require("../lib/forwarder");
program
    .command('generateinvoice')
    .action(() => __awaiter(void 0, void 0, void 0, function* () {
    let resp = yield http
        .post('https://api.anypay.global/invoices')
        .auth('1fc38af9-11b9-462f-a6bc-85d7f3e2ee46', '')
        .send({
        currency: 'BCH',
        amount: 0.1
    });
    console.log(resp.body);
}));
program
    .command('forwardunspent')
    .action(() => __awaiter(void 0, void 0, void 0, function* () {
    yield lib_1.forwardUnspent();
    process.exit(0);
}));
program
    .command('manuallyprocesspayment <hash>')
    .action((hash) => __awaiter(void 0, void 0, void 0, function* () {
    yield http.post(`https://bch.anypay.global/v1/bch/transactions/${hash}`);
}));
program
    .command('getaddresspayments <address>')
    .action((address) => __awaiter(void 0, void 0, void 0, function* () {
}));
program
    .command('createaddressforward <destination> [callback_url]')
    .action((destination, callback_url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let forward = yield lib_1.createAddressForward({
            destination,
            callback_url
        });
        console.log(forward.toJSON());
    }
    catch (error) {
        console.error(error.message);
    }
}));
program
    .command('gettransaction <txid>')
    .action((txid) => __awaiter(void 0, void 0, void 0, function* () {
    let resp = yield jsonrpc_1.rpcCall('gettransaction', [txid]);
    console.log(resp);
}));
program
    .command('forwardpayment <txid>')
    .action((txid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let callback = yield forwarder_1.forwardPayment(txid);
        console.log(callback);
    }
    catch (error) {
        console.error(error.message);
    }
}));
program
    .command('newhdprivatekey')
    .action(() => __awaiter(void 0, void 0, void 0, function* () {
    let key = new bitcore_lib_cash_1.HDPrivateKey();
    console.log(key.toString());
}));
program
    .command('getnewaddress [nonce]')
    .action((nonce) => __awaiter(void 0, void 0, void 0, function* () {
    let privateKey = new bitcore_lib_cash_1.HDPrivateKey(process.env.HD_BCH_PRIVATE_KEY);
    let pubkey = privateKey.derive("m/0'");
    console.log(pubkey);
}));
program
    .command('rpcgetnewaddress')
    .action((nonce) => __awaiter(void 0, void 0, void 0, function* () {
    let resp = yield jsonrpc_1.rpcCall('getnewaddress');
    console.log(resp);
}));
program
    .command('sweepdust [address]')
    .action((address) => __awaiter(void 0, void 0, void 0, function* () {
    yield lib_1.sweepDust();
}));
program
    .command('listunspent [address]')
    .action((address) => __awaiter(void 0, void 0, void 0, function* () {
    let unspent = yield jsonrpc_1.rpcCall('listunspent', [0]);
    let spendable = unspent.filter(utxo => utxo.spendable);
    let notSpendable = unspent.filter(utxo => !utxo.spendable);
    spendable = spendable.filter(utxo => utxo.amount >= 0.0001);
    console.log(`${spendable.length} spendable utxos`);
    spendable.forEach(console.log);
    let address_forwards = yield models.AddressForward.findAll({
        where: {
            input_address: {
                [sequelize_1.Op.in]: spendable.map(s => s.address)
            }
        }
    });
    console.log(`${address_forwards.length} address forwards found`);
    for (let i = 0; i < spendable.length; i++) {
        let utxo = spendable[i];
        try {
            let resp = yield forwarder_1.forwardPayment(spendable[i].txid);
            console.log(resp);
        }
        catch (error) {
            console.error(error.message);
        }
    }
}));
program
    .command('sweepunspent [address]')
    .action((address) => __awaiter(void 0, void 0, void 0, function* () {
    let price = new bignumber_js_1.BigNumber(150);
    let fee = (new bignumber_js_1.BigNumber(0.1)).dividedBy(price);
    console.log('ten cents', fee);
    let unspent = yield jsonrpc_1.rpcCall('listunspent', [0]);
    let change = 'bitcoincash:qz7lh923zdpw6mwtrwsh5kz6y73avghxagup3qlpw5';
    console.log('unspent', unspent);
    let dustInputs = _.filter(unspent, utxo => {
        return utxo.confirmations < 100 && utxo.address !== change;
    }).map(utxo => {
        return {
            "txid": utxo.txid,
            "vout": utxo.vout,
            "amount": new bignumber_js_1.BigNumber(utxo.amount)
        };
    });
    console.log('dust inputs', dustInputs);
    let changeInput = _.filter(unspent, utxo => {
        return utxo.address === change;
    })[0];
    console.log("change input", changeInput);
    let totalDust = dustInputs.reduce((sum, input) => {
        return sum.plus(input.amount);
    }, new bignumber_js_1.BigNumber(0));
    console.log('total dust', totalDust.toNumber());
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
}));
program
    .command('reconcile')
    .action(() => __awaiter(void 0, void 0, void 0, function* () {
    let noForward = [];
    let yesForward = [];
    let resp = yield jsonrpc_1.rpcCall('listunspent', [0]);
    console.log(resp);
    console.log(`${resp.length} payments in wallet`);
    let utxos = resp;
    for (let i = 0; i < utxos.length; i++) {
        let utxo = utxos[i];
        console.log(utxo);
        let forward = yield models.AddressForward.findOne({ where: {
                input_address: utxo.address
            } });
        if (forward) {
            yesForward.push(utxo);
        }
        else {
            noForward.push(utxo);
        }
    }
    console.log(`${yesForward.length}.length payments to forward`);
    console.log(`${noForward.length}.length payments to not forward`);
}));
program
    .command('sweepdust')
    .action(() => __awaiter(void 0, void 0, void 0, function* () {
    let resp = yield lib_1.sweepDust();
    console.log(resp);
}));
program.parse(process.argv);
//# sourceMappingURL=cli.js.map