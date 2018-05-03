import {Oracle} from '../../types/interfaces';

export class RippleDirect implements Oracle {

  name: string = 'ripple:direct';

  registerAddress(address: string): Promise<string> {

    return Promise.resolve(address);
  };

  deregisterAddress(address: string): Promise<boolean> {

    return Promise.resolve(true);
  };
}

