import {Oracle} from '../../types/interfaces';
import {getNewAddress} from '../bitcoin_cash/forwarding_address_service';
const assert = require("assert");

export class BitcoinCashForwarder implements Oracle {

  name: string = 'bitcoincash:forwarder';

  async registerAddress(address: string): Promise<string> {

    let result = await getNewAddress(address);

    return result.input;
  };

  async deregisterAddress(address: string): Promise<boolean> {

    // not implemented yet in bitcoin cash forwarding address service

    return false;
  };
}

