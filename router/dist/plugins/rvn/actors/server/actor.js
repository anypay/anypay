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
const lib_1 = require("../../lib");
const events_1 = require("../../lib/events");
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        const Hapi = require('hapi');
        // Create a server with a host and port
        const server = Hapi.server({
            host: '0.0.0.0',
            port: process.env.PORT || 8000
        });
        server.route({
            method: 'POST',
            path: '/v1/rvn/transactions/{hash}',
            handler: function (request, h) {
                return __awaiter(this, void 0, void 0, function* () {
                    yield events_1.publishEvent('transaction.created', request.params.hash);
                });
            }
        });
        // Add the route
        server.route({
            method: 'POST',
            path: '/v1/rvn/forwards',
            handler: function (request, h) {
                return __awaiter(this, void 0, void 0, function* () {
                    console.log('PAYLOAD', request.payload);
                    try {
                        let forward = yield lib_1.createAddressForward(request.payload);
                        return forward;
                    }
                    catch (error) {
                        console.log(error.message);
                        return { error: error.message };
                    }
                });
            }
        });
        try {
            yield server.start();
        }
        catch (err) {
            console.log(err);
            process.exit(1);
        }
        console.log('Server running at:', server.info.uri);
    });
}
exports.start = start;
if (require.main === module) {
    start();
}
//# sourceMappingURL=actor.js.map