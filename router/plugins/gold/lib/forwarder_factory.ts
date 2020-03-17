import { Channel } from 'amqplib';
import * as lib from './index';
import * as bch from 'bitcore-lib-cash';
import * as Bchaddr from 'bchaddrjs-slp';
const tokenId = '8e635bcd1b97ad565b2fdf6b642e760762a386fe4df9e4961f2c13629221914f'

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
  bchOracleToken: string;
}

export class ForwarderFactory {

  config: ForwarderConfig;

  constructor(config: ForwarderConfig) {

    this.config = config;
  }

  newForwarder(params) {

    return new TxForwarder(params, this.config);
  }

}

interface Route {
  input: any;
  output: any;
  HDKeyAddress: any;
}

export class TxForwarder {

  output_hash: string;
  output_amount: number;
  fee?: number;
  outputTx?: {};
  fundingTxid?: string;
  outputBroadcast?: boolean;
  outputSigned?: boolean;
  route?: Route;
  privateKey?: string;
  forwardAmount: number;

  config: ForwarderConfig;
  inputTx : {};
  input_txid: number;

  constructor(params, config) {

    this.config = config;
    this.inputTx = params.tx;
    this.outputSigned = false;
    this.outputBroadcast = false;
    this.input_txid = params.tx.txid;
  }

  async getAddressRoute(): Promise<Route> {

    // can always get address route
    // throw error if fails
    try{

      this.route = await lib.getAddressRouteFromTx( this.inputTx )

      return this.route

    }catch(error){
    
      throw(error)

    }

  }

  async derivePrivateKey() {
    if (!this.route) {

      await this.getAddressRoute();
    }

    // if no address route, get address route first
    // derive and set privateKey given route id
    this.privateKey = lib.derivePrivateKey(new bch.HDPrivateKey(process.env.BCH_HD_PRIVATE_KEY), this.route.HDKeyAddress.id)


    return this.privateKey
    
  }


  async sendGold() {

   if (!this.privateKey) {
     await this.derivePrivateKey();
   }
    
    const values = await lib.sendSLPToken(tokenId, this.route, this.privateKey)

    this.outputTx = values[0];
    this.forwardAmount = values[1];
    console.log('OUTPUT tx' , this.outputTx)
    console.log('forward amount' , this.outputTx)

    return this.outputTx;

  }


  async fundSLPAddress(){

    let address = Bchaddr.toCashAddress(this.route.input.address);

    let amount = .00001;

    this.fundingTxid = await lib.sendBCH(address, amount);

     return this.fundingTxid
 
  }

  async publishForwarded(): Promise<any> {

    const msg = {
      input_hash: this.input_txid,
      input_address: this.route.input.address,
      output_hash: this.outputTx,
      output_currency: 'GOLD',
      output_address: this.route.output.address,
      output_amount: this.forwardAmount
    }

    console.log('publish foward', msg)

    await this.config.amqpChannel.publish('anypay.router', 'router.transaction.forwarded',
      Buffer.from(JSON.stringify(msg))
    )
  }

}

function satoshisToBCH(sats: number): number{
  return sats/100000000
}


