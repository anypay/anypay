#!/usr/bin/env ts-node
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
const __1 = require("../");
const program = require("commander");
const WALLET = 'Xxie51C2VsBC1bLUuWaCXKdJwEwtNzZPfU';
program
    .command('getbalance <account>')
    .action((account) => __awaiter(this, void 0, void 0, function* () {
    let wallet = new __1.RPCSimpleWallet('BCH', account || WALLET);
    let balance = yield wallet.getAddressUnspentBalance();
    console.log('balance', balance);
    process.exit(0);
}));
program
    .command('sendtoaddress <account> <destination> <amount>')
    .action((account, destination, amount) => __awaiter(this, void 0, void 0, function* () {
    let wallet = new __1.RPCSimpleWallet('BCH', account);
    let balance = yield wallet.getAddressUnspentBalance();
    let payment = yield wallet.sendToAddress(destination, parseFloat(amount));
    console.log('payment', payment);
    process.exit(0);
}));
program.parse(process.argv);
//# sourceMappingURL=rpcsimplewallet.js.map