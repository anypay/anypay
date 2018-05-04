import {Oracle} from '../../types/interfaces';
import {BaseOracle} from './base';

export class RippleDirect extends BaseOracle implements Oracle {

  name: string = 'ripple:direct';
}

