
import Instruction from './instruction'

interface PaymentOption {

  chain: string;

  currency: string;

  requiredFeeRate: number;

  instructions: Instruction[];

}


class PaymentOption {

}

export default PaymentOption

