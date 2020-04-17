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
const rvn_1 = require("../lib/rvn");
program
    .command('getnewaddress')
    .action(() => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield rvn_1.rpc('getnewaddress', []);
    console.log(result);
}));
program
    .command('transfer <amount> <address>')
    .action((amount, address) => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield rvn_1.sendAUG(parseFloat(amount), address);
    console.log(result);
}));
program.parse(process.argv);
//# sourceMappingURL=aug.js.map