const http = require("superagent")

require("dotenv").config();

import {Payment} from '../../../types/interfaces';

import * as amqp from 'amqplib';

import { connection, channel } from './amqp';

const routing_key = 'payment';

const exchange = 'anypay.payments';

const JSONRPC = require('./jsonrpc');
  
var rpc = new JSONRPC();

export async function anypay_checkAddressForPayments(address:string, currency:string){

let resp = await rpc.call('gettransaction', ['07321cba0486a942a36afd8f15243fc78d346e494ae0d4dea126b19f469bc334'])

  console.log(resp)

}
