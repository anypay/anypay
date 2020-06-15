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
const rpc_simple_wallet_1 = require("../lib/rpc_simple_wallet");
describe("Getting UTXOs from Bitcoin.com", () => {
    it("should get BCH utxos correctly", () => __awaiter(this, void 0, void 0, function* () {
        let address = 'bitcoincash:qp9jz20u2amv4cp5wm02zt7u00lujpdtgy48zsmlvp';
        let wallet = new rpc_simple_wallet_1.RPCSimpleWallet('BCH', address);
        let utxos = yield wallet.getUtxos();
        console.log(utxos);
    }));
});
//# sourceMappingURL=bitcoin_cash_utxo_test.js.map