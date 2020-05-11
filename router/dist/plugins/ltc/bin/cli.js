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
const models = require('../models');
require('dotenv').config();
const forwarder_1 = require("../lib/forwarder");
program
    .command('generateinvoice')
    .action(() => __awaiter(void 0, void 0, void 0, function* () {
    let resp = yield http
        .post('https://api.anypay.global/invoices')
        .auth('1fc38af9-11b9-462f-a6bc-85d7f3e2ee46', '')
        .send({
        currency: 'LTC',
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
    yield http.post(`https://ltc.anypay.global/v1/ltc/transactions/${hash}`);
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
    let privateKey = new bitcore_lib_cash_1.HDPrivateKey(process.env.HD_LTC_PRIVATE_KEY);
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
    .command('rpclistunspent')
    .action((nonce) => __awaiter(void 0, void 0, void 0, function* () {
    let resp = yield jsonrpc_1.rpcCall('listunspent', [0]);
    console.log(resp);
}));
program.parse(process.argv);
//# sourceMappingURL=cli.js.map