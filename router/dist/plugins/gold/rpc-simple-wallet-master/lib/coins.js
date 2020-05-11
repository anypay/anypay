"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
let coins = [];
exports.coins = coins;
coins['BCH'] = {
    "host": process.env.BCH_RPC_HOST,
    "port": process.env.BCH_RPC_PORT,
    "user": process.env.BCH_RPC_USER,
    "password": process.env.BCH_RPC_PASSWORD,
    "fee": .00001,
};
//# sourceMappingURL=coins.js.map