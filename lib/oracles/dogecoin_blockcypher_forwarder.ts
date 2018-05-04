import {Oracle} from '../../types/interfaces';

export class DogecoinBlockcypherForwarder implements Oracle {

  name: string = 'dogecoin:blockcypher:forwarder';

  registerAddress(address: string): Promise<string> {

    return Promise.resolve(address);
  };

  deregisterAddress(address: string): Promise<boolean> {

    return Promise.resolve(true);
  };
}

