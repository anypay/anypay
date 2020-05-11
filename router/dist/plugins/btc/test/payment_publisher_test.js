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
const assert = require('assert');
const lib_1 = require("../lib");
/*
 *  -- gettransaction(txid)
 * {
  amount: 0,
  confirmations: 1572,
  blockhash: '0000000000000000000307d2090d024cae160a5c3f32ee66c83dc8a1788975d8',
  blockindex: 674,
  blocktime: 1565900821,
  txid: '23ccfdda936e7a48eda44ed403165a7863e368b1414bf6eb7cfc07e4847d9c01',
  walletconflicts: [],
  time: 1565899996,
  timereceived: 1565899996,
  'bip125-replaceable': 'no',
  details: [],
  hex: '01000000011286a08ad28e067e6d7e0ba76ca0827f5a41847e243a166ce615475b98a38e93000000006b483045022100e7ea4e4c3d584651a0423f400f6c7f095a0faac7a1f72e4d3cc373f937cc5030022078db1ea8629371bc3a85aee66f9be845d1c35df288ee9ba38e0c978b7ac7f73201210390b2916fe15c5403bbb0d337559f6ccba5f9fc60de2cafdeb58b7e678e9b7380ffffffff02606d0000000000001976a91456f102655b032a5cd93e47bf01934a61923c1b9988ac584f0000000000001976a9149c72a5f0c62514b5b02d11ea6fedd7651028725788ac00000000'
}
*/
describe("Converting tx hex into payments", () => {
    it("Should input raw tx and transform it into payment structs", () => __awaiter(void 0, void 0, void 0, function* () {
        let hex = '01000000011286a08ad28e067e6d7e0ba76ca0827f5a41847e243a166ce615475b98a38e93000000006b483045022100e7ea4e4c3d584651a0423f400f6c7f095a0faac7a1f72e4d3cc373f937cc5030022078db1ea8629371bc3a85aee66f9be845d1c35df288ee9ba38e0c978b7ac7f73201210390b2916fe15c5403bbb0d337559f6ccba5f9fc60de2cafdeb58b7e678e9b7380ffffffff02606d0000000000001976a91456f102655b032a5cd93e47bf01934a61923c1b9988ac584f0000000000001976a9149c72a5f0c62514b5b02d11ea6fedd7651028725788ac00000000';
        let payments = lib_1.transformHexToPayments(hex);
        assert.equal(payments.length, 2);
        assert.equal(payments[0].address, '18vhq82uAHPN8Lrjc11fAq98VdiegZ8GzH');
        assert.equal(payments[0].amount, 0.00028000);
        assert.equal(payments[0].currency, 'BTC');
        assert.equal(payments[0].hash, '23ccfdda936e7a48eda44ed403165a7863e368b1414bf6eb7cfc07e4847d9c01');
        assert.equal(payments[1].address, '1FGDkphs6orh2ci24aH1jrwFh1uVPbqjgh');
        assert.equal(payments[1].amount, 0.00020312);
        assert.equal(payments[1].currency, 'BTC');
        assert.equal(payments[1].hash, '23ccfdda936e7a48eda44ed403165a7863e368b1414bf6eb7cfc07e4847d9c01');
    }));
});
//# sourceMappingURL=payment_publisher_test.js.map