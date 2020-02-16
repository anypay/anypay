import { Channel } from 'amqplib';
import * as bsv from 'bsv';
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
  bsvOracleToken: string;
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

  inputTx:  bsv.Transaction;
  config: ForwarderConfig;
  output_hash: string;
  output_amount: number;
  output_address: string;
  fee?: number;
  outputTx?:  bsv.Transaction;
  outputBroadcast?: boolean;
  outputSigned?: boolean;
  route?: Route;
  privateKey?: bsv.PrivateKey;

  constructor(params: ForwarderParams, config: ForwarderConfig) {

    this.config = config;
    this.inputTx = new bsv.Transaction(params.hex);
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

  async derivePrivateKey(): bsv.PrivateKey {

    if (!this.route) {

      await this.getAddressRoute();
    }

    // if no address route, get address route first
    // derive and set privateKey given route id
    this.privateKey = lib.derivePrivateKey(new bsv.HDPrivateKey(process.env.BSV_HD_PRIVATE_KEY), this.route.HDKeyAddress.id)

    return this.privateKey
    
  }

  async calculateFee(): Promise<number> {
   
    try{

      this.fee = await lib.getSmartFee(6)

      return this.fee;

    }catch(error){
      
      throw(`error calculating tx fee ${error}`)

    }

  }

  async buildOutput(): bsv.Transaction {

    if (!this.privateKey) {

      await this.derivePrivateKey();
    }
    
    this.outputTx = lib.createOutputTxFromInputTx(this.inputTx, this.route,this.fee)

    this.output_amount = satoshisToBSV(this.outputTx.outputAmount);

    console.log('output_amount', this.output_amount)

    return this.outputTx;

  }


  async signOutput(): bsv.Transaction {

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
    this.output_hash = await lib.broadcastSignedTx(this.outputTx)

    this.outputBroadcast = true;

    return;

  }

  async publishForwarded(): Promise<any> {

    if (!this.outputBroadcast) {

       await this.broadcastOutput();
    }

    console.log(this.output_hash)

    await this.config.amqpChannel.publish('anypay.router', 'router.transaction.forwarded',
      Buffer.from(JSON.stringify({
        input_hash: this.inputTx.hash,
        input_address: this.route.input.address,
        output_hash: this.output_hash,
        output_currency: 'BSV',
        output_address: this.route.output.address,
        output_amount: this.route.output.amount
      }))
    )

  }

}

function satoshisToBSV(sats: number): number{
  return sats/100000000
}


