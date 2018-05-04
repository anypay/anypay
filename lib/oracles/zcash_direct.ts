import {Oracle} from '../../types/interfaces';
import {BaseOracle} from './base';

export class ZcashDirect extends BaseOracle implements Oracle {

  name: string = 'zcash:direct';
}

