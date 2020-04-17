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
const lib = require("./index");
const bch = require("bitcore-lib-cash");
const Bchaddr = require("bchaddrjs-slp");
const tokenId = '8e635bcd1b97ad565b2fdf6b642e760762a386fe4df9e4961f2c13629221914f';
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
        this.inputTx = params.tx;
        this.outputSigned = false;
        this.outputBroadcast = false;
        this.input_txid = params.tx.txid;
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
            this.privateKey = lib.derivePrivateKey(new bch.HDPrivateKey(process.env.BCH_HD_PRIVATE_KEY), this.route.HDKeyAddress.id);
            return this.privateKey;
        });
    }
    sendGold() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.privateKey) {
                yield this.derivePrivateKey();
            }
            const values = yield lib.sendSLPToken(tokenId, this.route, this.privateKey);
            this.outputTx = values[0];
            this.forwardAmount = values[1];
            console.log('OUTPUT tx', this.outputTx);
            console.log('forward amount', this.outputTx);
            return this.outputTx;
        });
    }
    fundSLPAddress() {
        return __awaiter(this, void 0, void 0, function* () {
            let address = Bchaddr.toCashAddress(this.route.input.address);
            let amount = .00001;
            this.fundingTxid = yield lib.sendBCH(address, amount);
            return this.fundingTxid;
        });
    }
    publishForwarded() {
        return __awaiter(this, void 0, void 0, function* () {
            const msg = {
                input_hash: this.input_txid,
                input_address: this.route.input.address,
                output_hash: this.outputTx,
                output_currency: 'GOLD',
                output_address: this.route.output.address,
                output_amount: this.forwardAmount
            };
            console.log('publish foward', msg);
            yield this.config.amqpChannel.publish('anypay.router', 'router.transaction.forwarded', Buffer.from(JSON.stringify(msg)));
        });
    }
}
exports.TxForwarder = TxForwarder;
function satoshisToBCH(sats) {
    return sats / 100000000;
}
//# sourceMappingURL=forwarder_factory.js.map