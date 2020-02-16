import { Channel } from 'amqplib';
import * as btc from 'bitcore-lib';
import * as lib from './index';

interface RPCConfig {
  host: string;
  port: string;
  user: string;
  password: string;
}

interface ForwarderConfig {
  rpc: RPCConfig;
  amqpChannel: Channel;
  xprivkey: string;
  btcOracleToken: string;
}

interface ForwarderParams {
  hex: string;
}

export class ForwarderFactory {

  config: ForwarderConfig;

  constructor(config: ForwarderConfig) {

    this.config = config;
  }

  newForwarder(params: ForwarderParams) {

    return new TxForwarder(params, this.config);
  }

}

interface Route {
  input: any;
  output: any;
  HDKeyAddress: any;
}

export class TxForwarder {

  inputTx:  btc.Transaction;
  config: ForwarderConfig;
  fee?: number;
  outputTx?:  btc.Transaction;
  outputBroadcast?: boolean;
  outputSigned?: boolean;
  route?: Route;
  privateKey?: btc.PrivateKey;

  constructor(params: ForwarderParams, config: ForwarderConfig) {

    this.config = config;
    this.inputTx = new btc.Transaction(params.hex);
    this.outputSigned = false;
    this.outputBroadcast = false;
  }

  async getAddressRoute(): Promise<Route> {

    // can always get address route
    // throw error if fails
    try{

      this.route = await lib.getAddressRouteFromTx( this.inputTx )

      return this.route

    }catch(error){
    
      console.log(error)

      throw(error)

    }

  }

  async derivePrivateKey(): btc.PrivateKey {
    if (!this.route) {

      await this.getAddressRoute();
    }

    // if no address route, get address route first
    // derive and set privateKey given route id
    this.privateKey = lib.derivePrivateKey(new btc.HDPrivateKey(process.env.BTC_HD_PRIVATE_KEY), this.route.HDKeyAddress.id)
    return this.privateKey
    
  }

  async calculateFee(): Promise<number> {
   
    try{

      this.fee = await lib.getSmartFee(12)

      return this.fee;

    }catch(error){
      
      throw(`error calculating tx fee ${error}`)

    }

  }

  async buildOutput(): btc.Transaction {

    if (!this.privateKey) {

      await this.derivePrivateKey();
    }
    
    this.outputTx = lib.createOutputTxFromInputTx(this.inputTx, this.route,this.fee)

    return this.outputTx;

  }


  async signOutput(): btc.Transaction {

    if (!this.outputTx) {

      await this.buildOutput();
    }

    this.outputTx = lib.signTransaction(this.outputTx, this.privateKey)

    this.outputSigned = true;

    return this.outputTx;

    // sign output and set output as signed

  }

  async broadcastOutput(): Promise<any> {

    if (!this.outputTx || !this.outputSigned) {

      await this.signOutput();
    }
    
    // broadcast signed transaction
    await lib.broadcastSignedTx(this.outputTx)

    this.outputBroadcast = true;

    return;

  }

  async publishForwarded(): Promise<any> {

    if (!this.outputBroadcast) {

      await this.broadcastOutput();
    }

    await this.config.amqpChannel.publish('anypay.router', 'btc.forwarded',
      Buffer.from(JSON.stringify({
        input: this.inputTx.hash,
        output: this.outputTx.hash
      }))
    )

  }

}

