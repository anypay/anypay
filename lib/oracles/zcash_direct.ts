import {Oracle} from '../../types/interfaces';

export class ZcashDirect implements Oracle {

  name: string = 'zcash:direct';

  registerAddress(address: string): Promise<string> {

    return Promise.resolve(address);
  };

  deregisterAddress(address: string): Promise<boolean> {

    return Promise.resolve(true);
  };
}

