import {Oracle} from '../../types/interfaces';

export class EthereumBlockcypherDirect implements Oracle {

  name: string = 'ethereum:blockcypher:direct';

  registerAddress(address: string): Promise<string> {

    return Promise.resolve(address);
  };

  deregisterAddress(address: string): Promise<boolean> {

    return Promise.resolve(true);
  };
}

