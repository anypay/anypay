import {Oracle} from '../../types/interfaces';

export class EthereumBlockcypherDirect implements Oracle {

  name: string = 'ethereum:blockcypher:direct';

  async registerAddress(address: string): Promise<string> {

    return address;
  };

  async deregisterAddress(address: string): Promise<boolean> {

    return true;
  };
}

