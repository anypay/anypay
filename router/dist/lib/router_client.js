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
require('dotenv').config();
const http = require("superagent");
function lookupOutputFromInput(currency, input_address) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("LOOKUP", {
            currency, input_address
        });
        currency = currency.toUpperCase();
        let authVariable = `${currency}_ORACLE_ACCESS_TOKEN`;
        console.log('AUTH VARIABLE', authVariable);
        const api_base = process.env.API_BASE || 'https://api.anypay.global';
        let resp = yield http
            .get(`${api_base}/address_routes/${currency}/${input_address}`)
            .auth(process.env[authVariable], '');
        return resp.body;
    });
}
exports.lookupOutputFromInput = lookupOutputFromInput;
//# sourceMappingURL=router_client.js.map