import {Oracle} from '../../types/interfaces';

export class DashBlockcypherForwarder implements Oracle {

  name: string = 'dash:blockcypher:forwarder';

  registerAddress(address: string): Promise<string> {

    return Promise.resolve(address);
  };

  deregisterAddress(address: string): Promise<boolean> {

    return Promise.resolve(true);
  };
}

