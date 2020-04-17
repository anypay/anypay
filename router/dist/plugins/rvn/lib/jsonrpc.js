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
require("dotenv").config();
const http = require("superagent");
function rpcCall(method, params = []) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let resp = yield http
                .post(`http://${process.env.RVN_RPC_HOST}:${process.env.RVN_RPC_PORT}`)
                .auth(process.env.RVN_RPC_USER, process.env.RVN_RPC_PASSWORD)
                .send({
                method,
                params
            });
            return resp.body.result;
        }
        catch (error) {
            console.error(error.message, error.response.body.error.message);
            throw error;
        }
    });
}
exports.rpcCall = rpcCall;
//# sourceMappingURL=jsonrpc.js.map