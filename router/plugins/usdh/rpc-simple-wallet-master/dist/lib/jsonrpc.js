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
require("dotenv").config();
const http = require("superagent");
const coins_1 = require("./coins");
class JsonRPC {
    constructor(coin) {
        this.host = coins_1.coins[coin].host;
        this.port = coins_1.coins[coin].port;
        this.user = coins_1.coins[coin].user;
        this.password = coins_1.coins[coin].password;
        this.fee = coins_1.coins[coin].fee;
    }
    call(method, params = []) {
        return __awaiter(this, void 0, void 0, function* () {
            var resp;
            if (this.port) {
                resp = yield http
                    .post(`http://${this.host}:${this.port}`)
                    .auth(this.user, this.password)
                    .send({
                    method,
                    params
                });
            }
            else {
                resp = yield http
                    .post(`https://${this.host}`)
                    .auth(this.user, this.password)
                    .send({
                    method,
                    params
                });
            }
            if (resp.body) {
                return resp.body.result;
            }
            else {
                throw new Error(resp);
            }
        });
    }
}
exports.JsonRPC = JsonRPC;
function rpcCall(method, params = []) {
    return __awaiter(this, void 0, void 0, function* () {
        let resp = yield http
            .post(`http://${process.env.DASH_RPC_HOST}:${process.env.DASH_RPC_PORT}`)
            .auth(process.env.DASH_RPC_USER, process.env.DASH_RPC_PASSWORD)
            .send({
            method,
            params
        });
        console.log(resp.body);
        return resp.body.result;
    });
}
exports.rpcCall = rpcCall;
//# sourceMappingURL=jsonrpc.js.map