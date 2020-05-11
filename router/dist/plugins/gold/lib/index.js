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
const router_client_1 = require("../../../lib/router_client");
const rpc_simple_wallet_master_1 = require("../rpc-simple-wallet-master");
const BITBOXSDK = require('bitbox-sdk');
const BigNumber = require('bignumber.js');
const slpjs = require('slpjs');
function getAddressRouteFromTx(tx) {
    return __awaiter(this, void 0, void 0, function* () {
        let outputs = tx.vout.filter((out, index) => {
            //Ignore outputs with 0 tokens send
            if (out.scriptPubKey.slpAddrs && tx.tokenInfo.sendOutputs[index] / 1000 > 0) {
                return true;
            }
            return false;
        });
        var route;
        var value;
        for (let i = 0; i < outputs.length; i++) {
            let address = outputs[i].scriptPubKey.slpAddrs[0];
            try {
                route = yield router_client_1.lookupOutputFromInput('GOLD', address);
                console.log(`route found for ${address}`);
            }
            catch (error) {
                console.log(`error no address found for ${address}`);
            }
            if (route) {
                return route;
            }
        }
        if (!route) {
            throw (`No Address route found for tx ${tx.hash}`);
        }
        return null;
    });
}
exports.getAddressRouteFromTx = getAddressRouteFromTx;
function satoshisToBCH(sats) {
    return sats / 100000000;
}
function bchToSatoshis(bch) {
    return bch * 100000000 | 0;
}
function derivePrivateKey(pk, nonce) {
    return pk.deriveChild(nonce).privateKey.toWIF();
}
exports.derivePrivateKey = derivePrivateKey;
function sendSLPToken(tokenId, route, pk) {
    return __awaiter(this, void 0, void 0, function* () {
        yield sleep(1000);
        const BITBOX = new BITBOXSDK.BITBOX({ restURL: 'https://rest.bitcoin.com/v2/' });
        const fundingAddress = route.input.address; // <-- must be simpleledger format
        const fundingWif = pk; // <-- compressed WIF format
        const tokenReceiverAddress = [route.output.address]; // <-- must be simpleledger format
        const bchChangeReceiverAddress = route.input.address; // <-- must be simpleledger format
        const bitboxNetwork = new slpjs.BitboxNetwork(BITBOX);
        const tokenDecimals = 4;
        let balances = yield bitboxNetwork.getAllSlpBalancesAndUtxos(fundingAddress);
        let sendAmounts = [balances.slpTokenBalances[tokenId].toFixed() / Math.pow(10, tokenDecimals)];
        sendAmounts = sendAmounts.map(a => (new BigNumber(a)).times(Math.pow(10, tokenDecimals)));
        let inputUtxos = balances.slpTokenUtxos[tokenId];
        inputUtxos = inputUtxos.concat(balances.nonSlpUtxos);
        inputUtxos.forEach(txo => txo.wif = fundingWif);
        let sendTxid = yield bitboxNetwork.simpleTokenSend(tokenId, sendAmounts, inputUtxos, tokenReceiverAddress, bchChangeReceiverAddress);
        console.log("Send SLP Token txid: ", sendTxid);
        return [sendTxid, sendAmounts[0] / Math.pow(10, (tokenDecimals - 1))];
    });
}
exports.sendSLPToken = sendSLPToken;
function sendBCH(address, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        let account = process.env.SLP_FUNDING_ADDRESS;
        let wallet = new rpc_simple_wallet_master_1.RPCSimpleWallet('BCH', account);
        let balance = yield wallet.getAddressUnspentBalance();
        yield wallet.updateWallet();
        let txid = yield wallet.sendToAddress(address, amount);
        console.log('Forward funding tx: ', txid);
        return txid;
    });
}
exports.sendBCH = sendBCH;
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
//# sourceMappingURL=index.js.map