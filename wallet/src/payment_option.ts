
import Instruction from './instruction'

export default interface PaymentOption {

  chain: string;

  currency: string;

  requiredFeeRate: number;

  instructions: Instruction[];

}

