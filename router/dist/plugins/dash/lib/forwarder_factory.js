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
const dash = require("@dashevo/dashcore-lib");
const lib = require("./index");
class ForwarderFactory {
    constructor(config) {
        this.config = config;
    }
    newForwarder(params) {
        return new TxForwarder(params, this.config);
    }
}
exports.ForwarderFactory = ForwarderFactory;
class TxForwarder {
    constructor(params, config) {
        this.config = config;
        this.inputTx = new dash.Transaction(params.hex);
        this.outputSigned = false;
        this.outputBroadcast = false;
    }
    getAddressRoute() {
        return __awaiter(this, void 0, void 0, function* () {
            // can always get address route
            // throw error if fails
            try {
                this.route = yield lib.getAddressRouteFromTx(this.inputTx);
                return this.route;
            }
            catch (error) {
                console.log(error);
                throw (error);
            }
        });
    }
    derivePrivateKey() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.route) {
                yield this.getAddressRoute();
            }
            // if no address route, get address route first
            // derive and set privateKey given route id
            this.privateKey = lib.derivePrivateKey(new dash.HDPrivateKey(process.env.DASH_HD_PRIVATE_KEY), this.route.HDKeyAddress.id);
            return this.privateKey;
        });
    }
    calculateFee() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield lib.getSmartFee(12);
                return this.fee;
            }
            catch (error) {
                throw (`error calculating tx fee ${error}`);
            }
        });
    }
    buildOutput() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.privateKey) {
                yield this.derivePrivateKey();
            }
            this.outputTx = lib.createOutputTxFromInputTx(this.inputTx, this.route, this.fee);
            this.output_amount = satoshisToDASH(this.outputTx.outputAmount);
            return this.outputTx;
        });
    }
    signOutput() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.outputTx) {
                yield this.buildOutput();
            }
            this.outputTx = lib.signTransaction(this.outputTx, this.privateKey);
            this.outputSigned = true;
            return this.outputTx;
            // sign output and set output as signed
        });
    }
    broadcastOutput() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.outputTx || !this.outputSigned) {
                yield this.signOutput();
            }
            // broadcast signed transaction
            this.output_hash = yield lib.broadcastSignedTx(this.outputTx);
            this.outputBroadcast = true;
            return;
        });
    }
    publishForwarded() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.outputBroadcast) {
                yield this.broadcastOutput();
            }
            yield this.config.amqpChannel.publish('anypay.router', 'router.transaction.forwarded', Buffer.from(JSON.stringify({
                input_hash: this.inputTx.hash,
                input_address: this.route.input.address,
                output_hash: this.output_hash,
                output_currency: 'DASH',
                output_address: this.route.output.address,
                output_amount: this.output_amount
            })));
        });
    }
}
exports.TxForwarder = TxForwarder;
function satoshisToDASH(sats) {
    return sats / 100000000;
}
//# sourceMappingURL=forwarder_factory.js.map