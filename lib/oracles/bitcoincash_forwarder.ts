import {Oracle} from '../../types/interfaces';

export class BitcoinCashForwarder implements Oracle {

  name: string = 'bitcoincash:forwarder';

  registerAddress(address: string): Promise<string> {

    return Promise.resolve(address);
  };

  deregisterAddress(address: string): Promise<boolean> {

    return Promise.resolve(true);
  };
}

