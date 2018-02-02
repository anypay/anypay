let jayson = require('jayson');
let logger = require('winston');
let hapi = require('hapi');
let uuid = require('uuid');

const blockcypher = require('./blockcypher');
const rpcServer = require('./rpc');

const amqpUrl = process.env.AMQP_URL ||
  'amqp://guest:guest@blockcypher.anypay.global:5672/';

let restServer = require('./rest');


