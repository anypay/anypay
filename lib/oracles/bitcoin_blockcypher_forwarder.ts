import {Oracle} from '../../types/interfaces';

export class BitcoinBlockcypherForwarder implements Oracle {

  name: string = 'bitcoin:blockcypher:forwarder';

  registerAddress(address: string): Promise<string> {

    return Promise.resolve(address);
  };

  deregisterAddress(address: string): Promise<boolean> {

    return Promise.resolve(true);
  };
}

