import {Oracle} from '../../types/interfaces';

export class LitecoinBlockcypherForwarder implements Oracle {

  name: string = 'litecoin:blockcypher:forwarder';

  registerAddress(address: string): Promise<string> {

    return Promise.resolve(address);
  };

  deregisterAddress(address: string): Promise<boolean> {

    return Promise.resolve(true);
  };
}

